import { motion } from 'framer-motion';
import { Bell, Moon, Sun, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useTeacher } from '../../context/TeacherContext';
import { useAuth } from '../../context/AuthContext';
import { useNotificationCount } from '../../hooks/useNotificationCount';

const TeacherHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isSidebarCollapsed } = useTeacher();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { count } = useNotificationCount();
  
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
    <header 
      className={`sticky top-0 h-20 bg-white dark:bg-secondary-main border-b border-neutral-lightGray/20 dark:border-secondary-light/20 shadow-md z-30 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-0 md:left-[80px]' : 'left-0 md:left-[280px]'
      }`}
    >
      <div className="flex items-center justify-end h-full px-4 md:px-8 gap-4">
        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-lg bg-neutral-lightGray/30 dark:bg-secondary-light/20 hover:bg-primary-light/10 dark:hover:bg-secondary-light/30 text-neutral-darkGray dark:text-neutral-lightGray transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  navigate('/teacher/notifications');
                }
              }}
              className="relative p-3 rounded-lg bg-neutral-lightGray/30 dark:bg-secondary-light/20 hover:bg-primary-light/10 dark:hover:bg-secondary-light/30 text-neutral-darkGray dark:text-neutral-lightGray transition-colors"
            >
              <Bell className="w-5 h-5" />
              {count.total > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                  {count.total > 99 ? '99+' : count.total}
                </span>
              )}
            </motion.button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-main rounded-lg shadow-xl border border-neutral-lightGray/20 dark:border-secondary-light/20 overflow-hidden"
              >
                <div className="p-4 border-b border-neutral-lightGray/20 dark:border-secondary-light/20">
                  <h3 className="font-bold text-neutral-darkGray dark:text-white">
                    Notifications
                    {count.total > 0 && (
                      <span className="ml-2 text-sm text-neutral-gray">
                        ({count.total} unread)
                      </span>
                    )}
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {count.total === 0 ? (
                    <div className="p-4 text-center text-neutral-gray">
                      No new notifications
                    </div>
                  ) : (
                    <div className="p-4">
                      <button
                        onClick={() => navigate('/teacher/notifications')}
                        className="w-full py-2 px-4 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        View All Notifications ({count.total})
                      </button>
                      {count.admin_notifications > 0 && (
                        <p className="mt-2 text-xs text-neutral-gray text-center">
                          {count.admin_notifications} from Admin
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-main to-accent-cyan flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0) || 'T'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-neutral-darkGray dark:text-white">
                  {user?.name || 'Teacher'}
                </p>
                <p className="text-xs text-neutral-gray">Teacher</p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-gray dark:text-neutral-lightGray" />
            </motion.button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-main rounded-lg shadow-xl border border-neutral-lightGray/20 dark:border-secondary-light/20 overflow-hidden"
              >
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate('/teacher/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors text-left"
                  >
                    <User className="w-5 h-5 text-neutral-gray" />
                    <span className="text-sm font-medium text-neutral-darkGray dark:text-white">
                      My Profile
                    </span>
                  </button>
                  <hr className="my-2 border-neutral-lightGray/20 dark:border-secondary-light/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
