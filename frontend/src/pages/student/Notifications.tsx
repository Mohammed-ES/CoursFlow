import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Eye,
  X,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Inbox,
  GraduationCap,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface AdminNotification {
  id: number;
  title: string;
  content: string;
  type: 'announcement' | 'alert' | 'info' | 'update' | 'reminder';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target_audience: 'all_teachers' | 'all_students' | 'both';
  is_published: boolean;
  published_at?: string;
  expires_at?: string;
  is_active: boolean;
  is_read: boolean;
  read_at?: string;
  admin?: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface TeacherNotification {
  id: number;
  title: string;
  content: string;
  type: 'announcement' | 'reminder' | 'alert' | 'info';
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';
  course_id?: number;
  course?: {
    id: number;
    title: string;
  };
  published: boolean;
  teacher?: {
    id: number;
    name: string;
  };
  available_from?: string;
  available_until?: string;
  created_at: string;
  is_read: boolean;
  read_at?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const StudentNotifications = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'teachers'>('admin');
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [teacherNotifications, setTeacherNotifications] = useState<TeacherNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAdminNotif, setSelectedAdminNotif] = useState<AdminNotification | null>(null);
  const [selectedTeacherNotif, setSelectedTeacherNotif] = useState<TeacherNotification | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      if (activeTab === 'admin') {
        const response = await axios.get(`${API_BASE_URL}/student/admin-notifications`, {
          headers: getAuthHeaders(),
        });
        setAdminNotifications(response.data.data || []);
      } else {
        const response = await axios.get(`${API_BASE_URL}/student/teacher-notifications`, {
          headers: getAuthHeaders(),
        });
        setTeacherNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAdminNotification = async (notification: AdminNotification) => {
    setSelectedAdminNotif(notification);
    setShowViewModal(true);

    // Mark as read if not already read
    if (!notification.is_read) {
      try {
        await axios.post(
          `${API_BASE_URL}/student/admin-notifications/${notification.id}/mark-read`,
          {},
          { headers: getAuthHeaders() }
        );
        fetchNotifications();
        // Notify header to update badge
        window.dispatchEvent(new Event('notificationUpdated'));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleViewTeacherNotification = async (notification: TeacherNotification) => {
    setSelectedTeacherNotif(notification);
    setShowViewModal(true);

    // Mark as read if not already read
    if (!notification.is_read) {
      try {
        await axios.post(
          `${API_BASE_URL}/student/teacher-notifications/${notification.id}/mark-read`,
          {},
          { headers: getAuthHeaders() }
        );
        fetchNotifications();
        // Notify header to update badge
        window.dispatchEvent(new Event('notificationUpdated'));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'alert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'announcement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'update':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'reminder':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium':
      case 'normal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      case 'announcement':
        return <Bell className="w-5 h-5" />;
      case 'update':
        return <Info className="w-5 h-5" />;
      case 'reminder':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadAdminCount = adminNotifications.filter((n) => !n.is_read).length;
  const unreadTeacherCount = teacherNotifications.filter((n) => !n.is_read).length;

  return (
    <StudentLayout title="Notifications">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Bell className="w-8 h-8 text-primary-main" />
            <h1 className="text-3xl font-bold text-secondary-main dark:text-white">
              Notifications
            </h1>
          </div>
          <p className="text-neutral-gray">
            View notifications from administrators and your teachers
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-neutral-light dark:border-neutral-dark">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'admin'
                  ? 'text-primary-main'
                  : 'text-neutral-gray hover:text-secondary-main dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Inbox className="w-5 h-5" />
                <span>From Admin</span>
                {unreadAdminCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary-main text-white rounded-full">
                    {unreadAdminCount}
                  </span>
                )}
              </div>
              {activeTab === 'admin' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-main"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'teachers'
                  ? 'text-primary-main'
                  : 'text-neutral-gray hover:text-secondary-main dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>From Teachers</span>
                {unreadTeacherCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary-main text-white rounded-full">
                    {unreadTeacherCount}
                  </span>
                )}
              </div>
              {activeTab === 'teachers' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-main"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Admin Notifications Tab */}
            {activeTab === 'admin' && (
              <>
                {adminNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-secondary-dark rounded-lg">
                    <Inbox className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
                    <p className="text-neutral-gray">No admin notifications</p>
                  </div>
                ) : (
                  adminNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-secondary-dark rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                        !notification.is_read ? 'border-l-4 border-primary-main' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                              {getTypeIcon(notification.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-secondary-main dark:text-white">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-neutral-gray">
                                From Admin • {formatDate(notification.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {!notification.is_read && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                New
                              </span>
                            )}
                          </div>
                          <div
                            className="text-neutral-gray text-sm line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: notification.content }}
                          />
                        </div>

                        {/* Actions */}
                        <div className="ml-4">
                          <button
                            onClick={() => handleViewAdminNotification(notification)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {/* Teacher Notifications Tab */}
            {activeTab === 'teachers' && (
              <>
                {teacherNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-secondary-dark rounded-lg">
                    <GraduationCap className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
                    <p className="text-neutral-gray">No teacher notifications</p>
                  </div>
                ) : (
                  teacherNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-secondary-dark rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                        !notification.is_read ? 'border-l-4 border-primary-main' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                              {getTypeIcon(notification.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-secondary-main dark:text-white">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-neutral-gray">
                                {notification.teacher?.name} • {notification.course?.title} • {formatDate(notification.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {!notification.is_read && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                New
                              </span>
                            )}
                          </div>
                          <div
                            className="text-neutral-gray text-sm line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: notification.content }}
                          />
                        </div>

                        {/* Actions */}
                        <div className="ml-4">
                          <button
                            onClick={() => handleViewTeacherNotification(notification)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* View Modal for Admin Notifications */}
      {showViewModal && selectedAdminNotif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-secondary-dark rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-light dark:border-neutral-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${getTypeColor(selectedAdminNotif.type)}`}>
                    {getTypeIcon(selectedAdminNotif.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      {selectedAdminNotif.title}
                    </h2>
                    <p className="text-sm text-neutral-gray">
                      From Admin • {formatDate(selectedAdminNotif.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedAdminNotif(null);
                  }}
                  className="p-2 hover:bg-neutral-light dark:hover:bg-neutral-dark rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedAdminNotif.type)}`}>
                  {selectedAdminNotif.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedAdminNotif.priority)}`}>
                  {selectedAdminNotif.priority}
                </span>
              </div>

              <div
                className="prose dark:prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: selectedAdminNotif.content }}
              />

              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-light dark:bg-neutral-dark rounded-lg">
                <div>
                  <p className="text-sm text-neutral-gray mb-1">Published</p>
                  <p className="font-semibold text-secondary-main dark:text-white">
                    {selectedAdminNotif.published_at ? formatDate(selectedAdminNotif.published_at) : 'N/A'}
                  </p>
                </div>
                {selectedAdminNotif.expires_at && (
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Expires</p>
                    <p className="font-semibold text-secondary-main dark:text-white">
                      {formatDate(selectedAdminNotif.expires_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Modal for Teacher Notifications */}
      {showViewModal && selectedTeacherNotif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-secondary-dark rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-light dark:border-neutral-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${getTypeColor(selectedTeacherNotif.type)}`}>
                    {getTypeIcon(selectedTeacherNotif.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      {selectedTeacherNotif.title}
                    </h2>
                    <p className="text-sm text-neutral-gray">
                      {selectedTeacherNotif.teacher?.name} • {selectedTeacherNotif.course?.title} • {formatDate(selectedTeacherNotif.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedTeacherNotif(null);
                  }}
                  className="p-2 hover:bg-neutral-light dark:hover:bg-neutral-dark rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedTeacherNotif.type)}`}>
                  {selectedTeacherNotif.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTeacherNotif.priority)}`}>
                  {selectedTeacherNotif.priority}
                </span>
              </div>

              <div
                className="prose dark:prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: selectedTeacherNotif.content }}
              />

              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-light dark:bg-neutral-dark rounded-lg">
                {selectedTeacherNotif.available_from && (
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Available From</p>
                    <p className="font-semibold text-secondary-main dark:text-white">
                      {formatDate(selectedTeacherNotif.available_from)}
                    </p>
                  </div>
                )}
                {selectedTeacherNotif.available_until && (
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Available Until</p>
                    <p className="font-semibold text-secondary-main dark:text-white">
                      {formatDate(selectedTeacherNotif.available_until)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentNotifications;

