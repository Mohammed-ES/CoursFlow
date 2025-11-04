import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Calendar, Shield, Lock, Edit, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EditProfileModal from '../../components/admin/EditProfileModal';
import ChangePasswordModal from '../../components/admin/ChangePasswordModal';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Administrator',
    joinedDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleUpdateProfile = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/admin/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setUser((prev) => ({ ...prev, ...userData }));
      
      showToast('Profil mis à jour avec succès !');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/admin/password', passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Mot de passe changé avec succès !');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-main border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Success Toast */}
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
            Mon Profil
          </h1>
          <p className="text-neutral-darkGray dark:text-neutral-gray">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </motion.div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <div className="flex flex-col items-center text-center">
                {/* Avatar without camera icon */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-main to-accent-cyan flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-secondary-main dark:text-white mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-neutral-gray mb-2">{user.email}</p>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>{user.role}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Account Information Card */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-secondary-main dark:text-white">
                  Informations du compte
                </h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-gray mb-1">Nom complet</p>
                    <p className="text-lg font-semibold text-secondary-main dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-gray mb-1">Adresse email</p>
                    <p className="text-lg font-semibold text-secondary-main dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-gray mb-1">Rôle</p>
                    <p className="text-lg font-semibold text-secondary-main dark:text-white">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-gray mb-1">Date d'inscription</p>
                    <p className="text-lg font-semibold text-secondary-main dark:text-white">
                      {new Date(user.joinedDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-main dark:text-white mb-2">
                    Sécurité
                  </h3>
                  <p className="text-sm text-neutral-gray">
                    Gérez votre mot de passe et la sécurité de votre compte
                  </p>
                </div>
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  variant="secondary"
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Modals */}
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentUser={user}
          onSave={handleUpdateProfile}
        />
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSave={handleChangePassword}
        />
      </div>
    </AdminLayout>
  );
};

export default Profile;
