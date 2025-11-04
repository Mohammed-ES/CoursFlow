import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Moon, Sun, User, ChevronDown, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface TeacherHeaderProps {
  title: string;
  subtitle?: string;
}

const TeacherHeader = ({ title, subtitle }: TeacherHeaderProps) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-secondary-main shadow-md sticky top-0 z-40 border-b border-neutral-lightGray/20 dark:border-secondary-light/20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-darkGray dark:text-neutral-lightGray">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-neutral-gray dark:text-neutral-lightGray/70 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-neutral-lightGray/30 dark:bg-secondary-light/20 rounded-lg px-4 py-2 w-64">
              <Search className="w-5 h-5 text-neutral-gray dark:text-neutral-lightGray/70 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-neutral-darkGray dark:text-neutral-lightGray w-full placeholder-neutral-gray dark:placeholder-neutral-lightGray/50"
              />
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-warning-main" />
              ) : (
                <Moon className="w-5 h-5 text-primary-main" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-neutral-darkGray dark:text-neutral-lightGray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-main rounded-full"></span>
              </motion.button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-main rounded-lg shadow-xl border border-neutral-lightGray/20 dark:border-secondary-light/20 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-neutral-lightGray/20 dark:border-secondary-light/20">
                    <h3 className="text-sm font-semibold text-neutral-darkGray dark:text-neutral-lightGray">
                      Notifications
                    </h3>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-neutral-lightGray/10 dark:hover:bg-secondary-light/10 transition-colors cursor-pointer border-b border-neutral-lightGray/10 dark:border-secondary-light/10">
                      <p className="text-sm text-neutral-darkGray dark:text-neutral-lightGray font-medium">
                        New student enrolled
                      </p>
                      <p className="text-xs text-neutral-gray dark:text-neutral-lightGray/70 mt-1">
                        John Doe enrolled in Web Development
                      </p>
                      <p className="text-xs text-primary-main dark:text-primary-light mt-1">
                        2 hours ago
                      </p>
                    </div>

                    <div className="p-4 hover:bg-neutral-lightGray/10 dark:hover:bg-secondary-light/10 transition-colors cursor-pointer border-b border-neutral-lightGray/10 dark:border-secondary-light/10">
                      <p className="text-sm text-neutral-darkGray dark:text-neutral-lightGray font-medium">
                        Quiz completed
                      </p>
                      <p className="text-xs text-neutral-gray dark:text-neutral-lightGray/70 mt-1">
                        5 students completed the Laravel quiz
                      </p>
                      <p className="text-xs text-primary-main dark:text-primary-light mt-1">
                        5 hours ago
                      </p>
                    </div>

                    <div className="p-4 hover:bg-neutral-lightGray/10 dark:hover:bg-secondary-light/10 transition-colors cursor-pointer">
                      <p className="text-sm text-neutral-darkGray dark:text-neutral-lightGray font-medium">
                        Low attendance alert
                      </p>
                      <p className="text-xs text-neutral-gray dark:text-neutral-lightGray/70 mt-1">
                        3 students have less than 70% attendance
                      </p>
                      <p className="text-xs text-primary-main dark:text-primary-light mt-1">
                        1 day ago
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-neutral-lightGray/20 dark:border-secondary-light/20">
                    <Link
                      to="/teacher/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-primary-main hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-main font-medium w-full text-center block"
                    >
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-neutral-darkGray dark:text-neutral-lightGray">
                    {user?.name || 'Teacher'}
                  </p>
                  <p className="text-xs text-neutral-gray dark:text-neutral-lightGray/70">
                    Teacher Account
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-darkGray dark:text-neutral-lightGray hidden md:block" />
              </motion.button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-main rounded-lg shadow-xl border border-neutral-lightGray/20 dark:border-secondary-light/20 overflow-hidden"
                >
                  {/* Profile Info */}
                  <div className="p-4 border-b border-neutral-lightGray/20 dark:border-secondary-light/20">
                    <p className="font-semibold text-neutral-darkGray dark:text-neutral-lightGray">
                      {user?.name || 'Teacher'}
                    </p>
                    <p className="text-sm text-neutral-gray dark:text-neutral-lightGray/70">
                      {user?.email || 'teacher@coursflow.com'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/teacher/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full px-4 py-2 text-left hover:bg-neutral-lightGray/10 dark:hover:bg-secondary-light/10 transition-colors flex items-center space-x-3 text-neutral-darkGray dark:text-neutral-lightGray"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    
                    <div className="border-t border-neutral-lightGray/20 dark:border-secondary-light/20 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-error-light/10 transition-colors flex items-center space-x-3 text-error-main"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
