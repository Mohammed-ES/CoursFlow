import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  FileQuestion,
  Bell,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTeacher } from '../../context/TeacherContext';

const TeacherSidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useTeacher();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/teacher/dashboard',
    },
    {
      title: 'Students',
      icon: Users,
      path: '/teacher/students',
    },
    {
      title: 'Courses',
      icon: BookOpen,
      path: '/teacher/courses',
    },
    {
      title: 'Attendance',
      icon: ClipboardCheck,
      path: '/teacher/attendance',
    },
    {
      title: 'Quizzes',
      icon: FileQuestion,
      path: '/teacher/quiz',
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/teacher/notifications',
    },
    {
      title: 'Calendar',
      icon: Calendar,
      path: '/teacher/calendar',
    },
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
          {!isSidebarCollapsed && (
            <Link to="/teacher/dashboard" className="flex items-center space-x-3 group">
              <motion.img
                src="/image/CoursFlow_logo.png"
                alt="CoursFlow"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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
                    title={isSidebarCollapsed ? item.title : ''}
                  >
                    <Icon
                      className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} ${
                        active
                          ? 'text-white'
                          : 'text-primary-main dark:text-primary-light group-hover:text-primary-main dark:group-hover:text-primary-light'
                      }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="text-sm font-medium flex-1">{item.title}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.aside>
  );
};

export default TeacherSidebar;
