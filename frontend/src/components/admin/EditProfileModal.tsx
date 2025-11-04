import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onSave: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => Promise<void>;
}

const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: currentUser.phone,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Le prénom et le nom sont obligatoires');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (formData.phone.trim() && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onSave(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Une erreur s\'est produite lors de la mise à jour du profil');
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

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
                Modifier le profil
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
                  Profil mis à jour avec succès !
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Entrez votre prénom"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Entrez votre nom"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="admin@coursflow.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+212 6 12 34 56 78"
                    className="pl-10"
                  />
                </div>
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
                      <span>Enregistrement...</span>
                    </div>
                  ) : (
                    'Enregistrer'
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

export default EditProfileModal;
