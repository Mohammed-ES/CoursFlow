import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar as CalendarIcon,
  Award,
  Users,
  Save,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  ClipboardCheck,
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';
import toast from '../../utils/toast';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  subject: string;
  bio?: string;
  phone?: string;
  specialization?: string;
  years_of_experience?: number;
  profile_image?: string;
  statistics?: {
    total_students: number;
    total_courses: number;
    career_attendance_rate: number;
    average_quiz_score: number;
  };
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    bio: '',
    phone: '',
    specialization: '',
    years_of_experience: 0,
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getProfile();
      console.log('API Response:', response.data); // Debug log
      const profileData = response.data.data; // Backend returns {success: true, data: {...}}
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        subject: profileData.subject || '',
        bio: profileData.bio || '',
        phone: profileData.phone || '',
        specialization: profileData.specialization || '',
        years_of_experience: profileData.years_of_experience || 0,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await teacherAPI.updateProfile(formData);
      await fetchProfile();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.warning('Password must be at least 8 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      
      // Laravel expects new_password_confirmation instead of confirm_password
      const dataToSend = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.confirm_password,
      };
      
      await teacherAPI.changePassword(dataToSend);
      toast.success('Password changed successfully!');
      
      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setShowPasswordForm(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please check your current password.';
      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <User className="w-8 h-8 text-primary-main" />
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your personal information and teaching statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6"
            >
              {/* Profile Photo - Alphabetic Only */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center text-white text-3xl font-bold border-4 border-primary-main">
                  {getInitials(profile?.name || 'T')}
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile?.name}
                </h2>
                <p className="text-primary-main font-medium mb-2">{profile?.subject}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile?.specialization || 'No specialization set'}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.years_of_experience && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{profile.years_of_experience} years experience</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Forms and Statistics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-main" />
                Career Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-2" />
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {profile?.statistics?.total_students || 0}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">Total Students</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
                  <BookOpen className="w-8 h-8 text-green-600 dark:text-green-300 mb-2" />
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {profile?.statistics?.total_courses || 0}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-200">Courses Created</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
                  <ClipboardCheck className="w-8 h-8 text-orange-600 dark:text-orange-300 mb-2" />
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {profile?.statistics?.career_attendance_rate?.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-200">Attendance Rate</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
                  <Award className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-2" />
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {profile?.statistics?.average_quiz_score?.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-200">Avg Quiz Score</p>
                </div>
              </div>
            </motion.div>

            {/* Edit Profile Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit Profile
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.years_of_experience}
                      onChange={(e) =>
                        setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })
                      }
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    placeholder="e.g., Web Development, Data Science, etc."
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Change Password Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary-main" />
                  Change Password
                </h3>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-primary-main hover:underline text-sm"
                  >
                    Update Password
                  </button>
                )}
              </div>

              {showPasswordForm ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, current_password: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, new_password: e.target.value })
                        }
                        required
                        minLength={8}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Password must be at least 8 characters
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirm_password: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          confirm_password: '',
                        });
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Change Password
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep your account secure by using a strong password and changing it regularly.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default Profile;
