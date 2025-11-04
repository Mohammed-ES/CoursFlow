import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  X,
  CheckCircle,
  Shield,
  Key,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI, { StudentProfile as APIStudentProfile } from '../../services/studentAPI';

interface StudentProfile extends APIStudentProfile {
  enrolled_courses_count?: number;
  completed_quizzes_count?: number;
  average_score?: number;
  avatar?: string;
  created_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date_of_birth: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getProfile();
      const profileData = {
        ...response.data,
        avatar: response.data.profile_image,
        created_at: new Date().toISOString(),
      };
      setProfile(profileData);
      setFormData({
        name: response.data.name,
        phone: response.data.phone || '',
        address: response.data.address || '',
        date_of_birth: response.data.date_of_birth || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('phone', formData.phone);
      updateData.append('address', formData.address);
      updateData.append('date_of_birth', formData.date_of_birth);
      
      if (avatarFile) {
        updateData.append('avatar', avatarFile);
      }

      const response = await studentAPI.updateProfile(updateData);
      const updatedProfile = {
        ...response.data,
        avatar: response.data.profile_image,
        created_at: profile?.created_at || new Date().toISOString(),
      };
      setProfile(updatedProfile);
      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    try {
      const passwordUpdateData = new FormData();
      passwordUpdateData.append('current_password', passwordData.current_password);
      passwordUpdateData.append('password', passwordData.new_password);
      passwordUpdateData.append('password_confirmation', passwordData.new_password_confirmation);
      
      await studentAPI.updateProfile(passwordUpdateData);
      setShowPasswordModal(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please check your current password.');
    }
  };

  if (loading) {
    return (
      <StudentLayout title="My Profile" subtitle="Manage your account information and settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!profile) {
    return (
      <StudentLayout title="Profile Not Found" subtitle="Unable to load profile information">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h2>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Profile" subtitle="Manage your account information and settings">
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center"
          >
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-green-700 dark:text-green-300 font-semibold">{successMessage}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Avatar Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                    {avatarPreview || profile.avatar ? (
                      <img
                        src={avatarPreview || profile.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary-main text-white rounded-full cursor-pointer hover:bg-primary-dark transition-all shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {avatarPreview && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="mb-4 text-sm text-red-600 hover:text-red-700 dark:text-red-400 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove new photo
                  </button>
                )}

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{profile.email}</p>
                
                <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {profile.enrolled_courses_count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed Quizzes</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {profile.completed_quizzes_count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {profile.average_score ? `${profile.average_score}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary-main" />
                Security
              </h3>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-main to-primary-dark hover:from-primary-dark hover:to-primary-main text-white font-semibold rounded-lg transition-all"
              >
                <Key className="w-5 h-5 mr-2" />
                Change Password
              </button>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent resize-none"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={fetchProfile}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-main to-primary-dark hover:from-primary-dark hover:to-primary-main text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Key className="w-6 h-6 mr-2 text-primary-main" />
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, current_password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new_password: e.target.value })
                    }
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password_confirmation: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-main to-primary-dark hover:from-primary-dark hover:to-primary-main text-white font-semibold rounded-lg transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </StudentLayout>
  );
};

export default Profile;
