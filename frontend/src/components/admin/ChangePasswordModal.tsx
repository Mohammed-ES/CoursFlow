import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

const ChangePasswordModal = ({ isOpen, onClose, onSave }: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une lettre majuscule';
    }
    if (!/[a-z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une lettre minuscule';
    }
    if (!/[0-9]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    return null;
  };

  const getPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong';
    color: string;
    text: string;
  } => {
    if (password.length === 0) {
      return { strength: 'weak', color: 'bg-gray-300', text: '' };
    }
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) {
      return { strength: 'weak', color: 'bg-red-500', text: 'Faible' };
    } else if (score <= 4) {
      return { strength: 'medium', color: 'bg-yellow-500', text: 'Moyen' };
    } else {
      return { strength: 'strong', color: 'bg-green-500', text: 'Fort' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel');
      return;
    }

    if (!formData.newPassword) {
      setError('Veuillez entrer un nouveau mot de passe');
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onSave({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur s\'est produite lors du changement de mot de passe');
      console.error('Failed to change password:', err);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-secondary-light rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-lightGray dark:border-secondary-main">
              <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                Changer le mot de passe
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 dark:text-green-400 font-semibold">
                  Mot de passe changé avec succès !
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Mot de passe actuel <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    className="pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-main"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    className="pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-main"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-gray">Force du mot de passe</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength === 'weak' ? 'text-red-500' :
                        passwordStrength.strength === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-lightGray dark:bg-secondary-dark rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: passwordStrength.strength === 'weak' ? '33%' :
                                passwordStrength.strength === 'medium' ? '66%' : '100%'
                        }}
                        className={`h-full ${passwordStrength.color}`}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-3 p-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg">
                  <p className="text-xs text-neutral-gray mb-2 font-semibold">
                    Le mot de passe doit contenir :
                  </p>
                  <ul className="text-xs text-neutral-gray space-y-1">
                    <li className="flex items-center space-x-2">
                      <span className={formData.newPassword.length >= 8 ? 'text-green-500' : ''}>
                        • Au moins 8 caractères
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Une lettre majuscule
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Une lettre minuscule
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className={/[0-9]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Un chiffre
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Un caractère spécial (!@#$%...)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    className="pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-main"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-neutral-lightGray dark:border-secondary-main rounded-xl text-secondary-main dark:text-white hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors font-semibold"
                >
                  Annuler
                </button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Changement...</span>
                    </div>
                  ) : (
                    'Changer'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
