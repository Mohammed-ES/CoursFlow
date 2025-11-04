import { motion } from 'framer-motion';
import { Bell, Search, Moon, Sun, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { isSidebarCollapsed } = useAdmin();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const profileRef = useRef<HTMLDivElement>(null);

  // Load unread notifications count
  useEffect(() => {
    loadNotificationsCount();

    // Listen for notification updates
    const handleNotificationUpdate = () => {
      loadNotificationsCount();
    };

    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, []);

  const loadNotificationsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
        params: { published: false } // Count unpublished notifications
      });
      setUnreadCount(response.data.filter((n: any) => !n.published).length);
    } catch (error) {
      console.error('Failed to load notifications count:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
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
      className={`fixed top-0 right-0 h-20 bg-white dark:bg-secondary-main border-b border-neutral-lightGray/20 dark:border-secondary-light/20 shadow-md z-30 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-0 md:left-[80px]' : 'left-0 md:left-[280px]'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-8 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl min-w-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray dark:text-neutral-lightGray" />
            <input
              type="text"
              placeholder="Search students, teachers, courses..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-lightGray/30 dark:bg-secondary-light/20 rounded-lg border border-neutral-lightGray/20 dark:border-secondary-light/20 focus:outline-none focus:ring-2 focus:ring-primary-main/50 text-neutral-darkGray dark:text-white placeholder:text-neutral-gray transition-all"
            />
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2 md:space-x-4 ml-4">
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/notifications')}
            className="relative p-3 rounded-lg bg-neutral-lightGray/30 dark:bg-secondary-light/20 hover:bg-primary-light/10 dark:hover:bg-secondary-light/30 text-neutral-darkGray dark:text-neutral-lightGray transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white font-bold shadow-md">
                A
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-neutral-darkGray dark:text-white">
                  Admin User
                </p>
                <p className="text-xs text-neutral-gray">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-gray dark:text-neutral-lightGray" />
            </motion.button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-main rounded-lg shadow-xl border border-neutral-lightGray/20 dark:border-secondary-light/20 overflow-hidden"
              >
                <div className="p-4 border-b border-neutral-lightGray/20 dark:border-secondary-light/20">
                  <p className="font-semibold text-neutral-darkGray dark:text-white">
                    Admin User
                  </p>
                  <p className="text-sm text-neutral-gray">admin@coursflow.com</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={() => {
                      navigate('/admin/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors flex items-center space-x-3 text-neutral-darkGray dark:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>
                  <div className="border-t border-neutral-lightGray/20 dark:border-secondary-light/20 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
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

export default AdminHeader;
