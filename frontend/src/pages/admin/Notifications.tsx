import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users,
  Filter,
  GraduationCap,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import ConfirmModal from '../../components/modals/ConfirmModal';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  course_id?: number;
  course?: {
    id: number;
    title: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
  published: boolean;
  available_from?: string;
  available_until?: string;
  created_at: string;
  read_count?: number;
}

interface Course {
  id: number;
  title: string;
}

interface NotificationFormData {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  course_id: string;
  available_from: string;
  available_until: string;
}

const AdminNotifications = () => {
  const { success, error: showError } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  
  // Confirm modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [notificationToPublish, setNotificationToPublish] = useState<Notification | null>(null);

  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    content: '',
    type: 'info',
    priority: 'medium',
    course_id: '',
    available_from: '',
    available_until: '',
  });

  useEffect(() => {
    fetchNotifications();
    fetchCourses();
  }, [filterType, filterPriority, filterPublished]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (filterPublished !== 'all') params.published = filterPublished === 'published' ? 1 : 0;

      const response = await axios.get(`${API_BASE_URL}/admin/notifications`, {
        headers: getAuthHeaders(),
        params,
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses?all=true`, {
        headers: getAuthHeaders(),
      });
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
      };

      if (formData.course_id) data.course_id = parseInt(formData.course_id);
      if (formData.available_from) data.available_from = formData.available_from;
      if (formData.available_until) data.available_until = formData.available_until;

      if (selectedNotification) {
        await axios.put(
          `${API_BASE_URL}/admin/notifications/${selectedNotification.id}`,
          data,
          { headers: getAuthHeaders() }
        );
        success('Notification updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/notifications`,
          data,
          { headers: getAuthHeaders() }
        );
        success('Notification created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchNotifications();
      
      // Notify header to update notification count
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (err: any) {
      console.error('Error saving notification:', err);
      showError(err.response?.data?.message || 'Failed to save notification');
    }
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      content: notification.content,
      type: notification.type,
      priority: notification.priority,
      course_id: notification.course_id?.toString() || '',
      available_from: notification.available_from || '',
      available_until: notification.available_until || '',
    });
    setShowModal(true);
  };

  const handleDelete = (notification: Notification) => {
    setNotificationToDelete(notification.id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/admin/notifications/${notificationToDelete}`,
        { headers: getAuthHeaders() }
      );
      success('Notification deleted successfully!');
      fetchNotifications();
      setShowDeleteModal(false);
      setNotificationToDelete(null);
      
      // Notify header to update notification count
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (err) {
      console.error('Error deleting notification:', err);
      showError('Failed to delete notification');
    }
  };

  const handleTogglePublish = (notification: Notification) => {
    setNotificationToPublish(notification);
    setShowPublishModal(true);
  };

  const confirmTogglePublish = async () => {
    if (!notificationToPublish) return;

    try {
      if (notificationToPublish.published) {
        await axios.post(
          `${API_BASE_URL}/admin/notifications/${notificationToPublish.id}/unpublish`,
          {},
          { headers: getAuthHeaders() }
        );
        success('Notification unpublished successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/notifications/${notificationToPublish.id}/publish`,
          {},
          { headers: getAuthHeaders() }
        );
        success('Notification published successfully!');
      }
      
      fetchNotifications();
      setShowPublishModal(false);
      setNotificationToPublish(null);
      
      // Notify header to update notification count
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (err) {
      console.error('Error toggling publish:', err);
      showError('Failed to update notification status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 'medium',
      course_id: '',
      available_from: '',
      available_until: '',
    });
    setSelectedNotification(null);
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
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'success':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'alert':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-secondary-main dark:text-white flex items-center space-x-3">
              <Bell className="w-8 h-8" />
              <span>All Notifications</span>
            </h1>
            <p className="text-neutral-darkGray dark:text-neutral-gray mt-1">
              Manage and broadcast notifications to teachers and students
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            variant="primary"
            className="flex items-center space-x-2 mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add Notification</span>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Published Filter */}
              <select
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value)}
                className="px-4 py-2 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Notifications</p>
                <p className="text-3xl font-bold mt-1">{notifications.length}</p>
              </div>
              <Bell className="w-12 h-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Published</p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.filter((n) => n.published).length}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Urgent</p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.filter((n) => n.priority === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Draft</p>
                <p className="text-3xl font-bold mt-1">
                  {notifications.filter((n) => !n.published).length}
                </p>
              </div>
              <Filter className="w-12 h-12 text-purple-200" />
            </div>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
                  <p className="text-neutral-gray">No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Priority Indicator */}
                        <div className={`w-1 h-full ${getPriorityColor(notification.priority)} rounded-full`} />

                        {/* Type Icon */}
                        <div className={`p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-secondary-main dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.published && (
                              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                Draft
                              </span>
                            )}
                            <span className="px-2 py-1 bg-primary-light text-primary-main text-xs rounded-full">
                              {notification.priority}
                            </span>
                          </div>

                          <div
                            className="text-neutral-gray text-sm mb-3"
                            dangerouslySetInnerHTML={{
                              __html: notification.content.substring(0, 150) + '...',
                            }}
                          />

                          <div className="flex items-center space-x-4 text-xs text-neutral-gray">
                            {notification.teacher && (
                              <span className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>Teacher: {notification.teacher.name}</span>
                              </span>
                            )}
                            {notification.course && (
                              <span className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{notification.course.title}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                            </span>
                            {notification.read_count !== undefined && (
                              <span className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{notification.read_count} reads</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedNotification(notification);
                            setShowViewModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(notification)}
                          className="p-2 text-primary-main hover:bg-primary-light rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(notification)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            notification.published
                              ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}
                          title={notification.published ? 'Unpublish' : 'Publish'}
                        >
                          {notification.published ? 'Published' : 'Draft'}
                        </button>
                        <button
                          onClick={() => handleDelete(notification)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-neutral-lightGray dark:border-secondary-main">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                      {selectedNotification ? 'Edit Notification' : 'Create New Notification'}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-neutral-offWhite dark:hover:bg-secondary-dark rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-neutral-gray" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      required
                    />
                  </div>

                  {/* Type and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="alert">Alert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Priority *
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      Course (Optional)
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                    >
                      <option value="">All Courses</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                      Content *
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      className="bg-white dark:bg-secondary-dark rounded-xl"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          [{ color: [] }, { background: [] }],
                          ['link', 'clean'],
                        ],
                      }}
                    />
                  </div>

                  {/* Availability Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Available From
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.available_from}
                        onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-main dark:text-white mb-2">
                        Available Until
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.available_until}
                        onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowModal(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex items-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>{selectedNotification ? 'Update' : 'Create'} Notification</span>
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Modal */}
      {showViewModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-secondary-light rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-lightGray dark:border-secondary-main">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-main dark:text-white">
                  Notification Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-neutral-offWhite dark:hover:bg-secondary-dark rounded-lg transition-colors"
                >
                  <Eye className="w-6 h-6 text-neutral-gray" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(selectedNotification.type)}`}>
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-main dark:text-white">
                      {selectedNotification.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 ${getPriorityColor(selectedNotification.priority)} text-white text-xs rounded-full`}>
                        {selectedNotification.priority}
                      </span>
                      <span className={`px-2 py-1 ${getTypeColor(selectedNotification.type)} text-xs rounded-full`}>
                        {selectedNotification.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
              />

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-lightGray dark:border-secondary-main">
                {selectedNotification.teacher && (
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Teacher</p>
                    <p className="font-semibold text-secondary-main dark:text-white">
                      {selectedNotification.teacher.name}
                    </p>
                  </div>
                )}
                {selectedNotification.course && (
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Course</p>
                    <p className="font-semibold text-secondary-main dark:text-white">
                      {selectedNotification.course.title}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-neutral-gray mb-1">Created</p>
                  <p className="font-semibold text-secondary-main dark:text-white">
                    {new Date(selectedNotification.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-gray mb-1">Status</p>
                  <p className="font-semibold text-secondary-main dark:text-white">
                    {selectedNotification.published ? 'Published' : 'Draft'}
                  </p>
                </div>
                {selectedNotification.read_count !== undefined && (
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Read Count</p>
                    <p className="font-semibold text-secondary-main dark:text-white">
                      {selectedNotification.read_count}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setNotificationToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
      />

      {/* Publish/Unpublish Confirmation Modal */}
      <ConfirmModal
        isOpen={showPublishModal}
        onClose={() => {
          setShowPublishModal(false);
          setNotificationToPublish(null);
        }}
        onConfirm={confirmTogglePublish}
        title={notificationToPublish?.published ? 'Unpublish Notification' : 'Publish Notification'}
        message={
          notificationToPublish?.published
            ? 'Are you sure you want to unpublish this notification? Recipients will no longer see it.'
            : 'Are you sure you want to publish this notification? It will be visible to all recipients.'
        }
        confirmText={notificationToPublish?.published ? 'Unpublish' : 'Publish'}
        cancelText="Cancel"
        confirmStyle={notificationToPublish?.published ? 'warning' : 'primary'}
      />
    </AdminLayout>
  );
};

export default AdminNotifications;
