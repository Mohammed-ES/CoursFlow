import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Settings2,
  Bell,
  Globe,
  Palette,
  Phone,
  CheckCircle,
  Moon,
  Sun,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminSettings = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'CoursFlow',
    siteUrl: 'https://coursflow.com',
    primaryColor: '#003B73',
    theme: 'light',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSystemSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  const applySettings = (settings: typeof systemSettings) => {
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply primary color to CSS variables
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    // Save to localStorage for persistence
    localStorage.setItem('adminSettings', JSON.stringify(settings));
  };

  const handleSystemSettingsSave = () => {
    applySettings(systemSettings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleThemeToggle = () => {
    const newTheme = systemSettings.theme === 'light' ? 'dark' : 'light';
    const newSettings = { ...systemSettings, theme: newTheme };
    setSystemSettings(newSettings);
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
            Paramètres Système
          </h1>
          <p className="text-neutral-darkGray dark:text-neutral-gray">
            Gérez les préférences globales de l'application
          </p>
        </motion.div>

        {/* Success Toast */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Paramètres sauvegardés avec succès !</span>
          </motion.div>
        )}

        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                Configuration Système
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Nom du Site
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <input
                    type="text"
                    value={systemSettings.siteName}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        siteName: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                  />
                </div>
              </div>

              {/* Site URL */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  URL du Site
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                  <input
                    type="url"
                    value={systemSettings.siteUrl}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        siteUrl: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                  />
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Couleur Principale
                </label>
                <div className="flex items-center space-x-3">
                  <Palette className="w-5 h-5 text-neutral-gray" />
                  <input
                    type="color"
                    value={systemSettings.primaryColor}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        primaryColor: e.target.value,
                      })
                    }
                    className="w-20 h-10 border border-neutral-lightGray dark:border-secondary-main rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-neutral-gray">
                    {systemSettings.primaryColor}
                  </span>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                  Langue
                </label>
                <select
                  value={systemSettings.language}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      language: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-secondary-main dark:text-white mb-4">
                Préférences
              </h3>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-neutral-offWhite dark:bg-secondary-light rounded-xl">
                <div className="flex items-center space-x-3">
                  {systemSettings.theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-neutral-gray" />
                  ) : (
                    <Sun className="w-5 h-5 text-neutral-gray" />
                  )}
                  <div>
                    <span className="text-sm font-semibold text-secondary-main dark:text-white block">
                      Mode Sombre
                    </span>
                    <span className="text-xs text-neutral-gray">
                      Thème {systemSettings.theme === 'dark' ? 'sombre' : 'clair'} activé
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    systemSettings.theme === 'dark'
                      ? 'bg-primary-main'
                      : 'bg-neutral-lightGray'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{
                      left: systemSettings.theme === 'dark' ? '30px' : '2px',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-neutral-offWhite dark:bg-secondary-light rounded-xl">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-neutral-gray" />
                  <div>
                    <span className="text-sm font-semibold text-secondary-main dark:text-white block">
                      Notifications Email
                    </span>
                    <span className="text-xs text-neutral-gray">
                      Recevoir des notifications par email
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSystemSettings({
                      ...systemSettings,
                      emailNotifications: !systemSettings.emailNotifications,
                    })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    systemSettings.emailNotifications
                      ? 'bg-primary-main'
                      : 'bg-neutral-lightGray'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{
                      left: systemSettings.emailNotifications ? '30px' : '2px',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-neutral-offWhite dark:bg-secondary-light rounded-xl">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-neutral-gray" />
                  <div>
                    <span className="text-sm font-semibold text-secondary-main dark:text-white block">
                      Notifications SMS
                    </span>
                    <span className="text-xs text-neutral-gray">
                      Recevoir des notifications par SMS
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSystemSettings({
                      ...systemSettings,
                      smsNotifications: !systemSettings.smsNotifications,
                    })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    systemSettings.smsNotifications
                      ? 'bg-primary-main'
                      : 'bg-neutral-lightGray'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{
                      left: systemSettings.smsNotifications ? '30px' : '2px',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-neutral-offWhite dark:bg-secondary-light rounded-xl">
                <div className="flex items-center space-x-3">
                  <Settings2 className="w-5 h-5 text-neutral-gray" />
                  <div>
                    <span className="text-sm font-semibold text-secondary-main dark:text-white block">
                      Mode Maintenance
                    </span>
                    <span className="text-xs text-neutral-gray">
                      Désactiver temporairement le site
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSystemSettings({
                      ...systemSettings,
                      maintenanceMode: !systemSettings.maintenanceMode,
                    })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    systemSettings.maintenanceMode
                      ? 'bg-red-500'
                      : 'bg-neutral-lightGray'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{
                      left: systemSettings.maintenanceMode ? '30px' : '2px',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            <Button
              onClick={handleSystemSettingsSave}
              variant="primary"
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500"
            >
              <Save className="w-5 h-5" />
              <span>Enregistrer les Paramètres</span>
            </Button>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
