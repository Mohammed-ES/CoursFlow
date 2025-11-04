import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const StudentSidebar = () => {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useStudent();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Quizzes', path: '/student/quizzes', icon: FileQuestion },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
    { name: 'Calendar', path: '/student/calendar', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? '80px' : '280px' }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-secondary-main shadow-xl z-50 flex flex-col border-r border-neutral-lightGray/20 dark:border-secondary-light/20 transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-20 border-b border-neutral-lightGray/20 dark:border-secondary-light/20 px-6 flex items-center justify-between">
          {!isSidebarCollapsed ? (
            <Link to="/student/dashboard" className="flex items-center space-x-3 group">
              <motion.img
                src="/image/CoursFlow_logo.png"
                alt="CoursFlow Logo"
                className="h-10 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ctext x="20" y="20" text-anchor="middle" dominant-baseline="middle" font-size="20" fill="%234F46E5"%3ECF%3C/text%3E%3C/svg%3E';
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-neutral-darkGray dark:text-neutral-lightGray">
                  CoursFlow
                </h2>
              </motion.div>
            </Link>
          ) : (
            <Link to="/student/dashboard" className="flex items-center justify-center w-full">
              <motion.img
                src="/image/CoursFlow_logo.png"
                alt="CoursFlow Logo"
                className="h-8 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ctext x="16" y="16" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="%234F46E5"%3ECF%3C/text%3E%3C/svg%3E';
                }}
              />
            </Link>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-neutral-lightGray/30 dark:hover:bg-secondary-light/20 transition-colors"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-neutral-darkGray dark:text-neutral-lightGray" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-neutral-darkGray dark:text-neutral-lightGray" />
            )}
          </motion.button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                      ${
                        active
                          ? 'bg-primary-main text-white shadow-md'
                          : 'text-neutral-darkGray dark:text-neutral-lightGray hover:bg-primary-light/10 dark:hover:bg-secondary-light/10'
                      }
                    `}
                    title={isSidebarCollapsed ? item.name : ''}
                  >
                    <Icon
                      className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} ${
                        active
                          ? 'text-white'
                          : 'text-primary-main dark:text-primary-light group-hover:text-primary-main dark:group-hover:text-primary-light'
                      }`}
                    />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-error-main text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button is removed */}
      </div>
    </motion.aside>
  );
};

export default StudentSidebar;
