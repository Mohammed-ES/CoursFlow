import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
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
  Inbox,
  Send,
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';
import { useToast } from '../../hooks/useToast';
import ConfirmModal from '../../components/modals/ConfirmModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  published: boolean;
  available_from?: string;
  available_until?: string;
  created_at: string;
  read_count?: number;
}

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

interface Course {
  id: number;
  title: string;
}

interface Student {
  id: number;
  name: string;
  email?: string;
}

interface NotificationFormData {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  course_id: string;
  available_from: string;
  available_until: string;
  student_ids: number[];
}

const Notifications = () => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedAdminNotif, setSelectedAdminNotif] = useState<AdminNotification | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  
  // Modal states
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
    student_ids: [],
  });

  useEffect(() => {
    if (activeTab === 'received') {
      fetchAdminNotifications();
    } else {
      fetchNotifications();
      fetchCourses();
      fetchStudents();
    }
  }, [activeTab, filterType, filterPriority, filterCourse, filterPublished]);

  const fetchAdminNotifications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterPriority !== 'all') params.priority = filterPriority;

      const response = await teacherAPI.getAdminNotifications(params);
      setAdminNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (filterCourse !== 'all') params.course_id = filterCourse;
      if (filterPublished !== 'all') params.published = filterPublished === 'published' ? 1 : 0;

      const response = await teacherAPI.getNotifications(params);
      setNotifications((response.data || []) as any);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await teacherAPI.getCourses({});
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await teacherAPI.getStudents();
      console.log('🔍 API Students Response:', response.data);
      if (response.data && response.data.length > 0) {
        response.data.forEach((s: any, index: number) => {
          console.log(`  Student [${index}]:`, { id: s.id, name: s.name, email: s.email });
        });
      }
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // No validation - if no students selected, notification goes to admin
    // If students are selected, it goes to those students
    
    try {
      const data: any = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
        send_to_admin: !formData.student_ids || formData.student_ids.length === 0, // Flag for admin
      };

      if (formData.course_id) data.course_id = parseInt(formData.course_id);
      if (formData.available_from) data.available_from = formData.available_from;
      if (formData.available_until) data.available_until = formData.available_until;
      
      // Only include student_ids if there are students selected
      if (formData.student_ids && formData.student_ids.length > 0) {
        data.student_ids = formData.student_ids;
      }

      console.log('🚀 Sending notification data:');
      console.log('  - student_ids:', JSON.stringify(data.student_ids));
      console.log('  - send_to_admin:', data.send_to_admin);
      console.log('  - title:', data.title);
      console.log('  - Full data:', JSON.stringify(data, null, 2));

      if (selectedNotification) {
        await teacherAPI.updateNotification(selectedNotification.id, data);
        success(data.send_to_admin 
          ? 'Notification sent to admin successfully' 
          : 'Notification updated successfully');
      } else {
        await teacherAPI.createNotification(data);
        success(data.send_to_admin 
          ? 'Notification sent to admin successfully' 
          : 'Notification created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchNotifications();
    } catch (err) {
      error(selectedNotification ? 'Failed to update notification' : 'Failed to create notification');
      console.error('Error saving notification:', err);
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
      student_ids: [], // Will be loaded from notification.students if available
    });
    setShowModal(true);
  };

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  const handleDelete = async (id: number) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;
    
    try {
      await teacherAPI.deleteNotification(notificationToDelete);
      success('Notification deleted successfully');
      fetchNotifications();
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    } catch (err) {
      error('Failed to delete notification');
      console.error('Error deleting notification:', err);
    }
  };

  const handleTogglePublish = async (notification: Notification) => {
    setNotificationToPublish(notification);
    setShowPublishModal(true);
  };

  const confirmTogglePublish = async () => {
    if (!notificationToPublish) return;

    try {
      if (notificationToPublish.published) {
        await teacherAPI.unpublishNotification(notificationToPublish.id);
        success('Notification unpublished successfully');
      } else {
        await teacherAPI.publishNotification(notificationToPublish.id);
        success('Notification published successfully');
      }
      fetchNotifications();
      setShowPublishModal(false);
      setNotificationToPublish(null);
    } catch (err) {
      error('Failed to update notification');
      console.error('Error toggling publish:', err);
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
      student_ids: [],
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

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'alert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredNotifications = notifications;

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary-main" />
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeTab === 'received'
                ? 'View notifications from admin'
                : 'Manage announcements and notifications for your students'}
            </p>
          </div>

          {activeTab === 'sent' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Notification
            </motion.button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'received'
                ? 'bg-primary-main text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Inbox className="w-5 h-5" />
            Received from Admin
            {adminNotifications.filter(n => !n.is_read).length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {adminNotifications.filter(n => !n.is_read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sent'
                ? 'bg-primary-main text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Send className="w-5 h-5" />
            My Notifications
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'received' ? (
          // Admin Notifications View
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
              </div>
            ) : adminNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No notifications
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't received any notifications from admin yet
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {adminNotifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      notif.is_read
                        ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750'
                        : 'border-primary-main bg-primary-50 dark:bg-primary-900/20'
                    }`}
                    onClick={async () => {
                      setSelectedAdminNotif(notif);
                      setShowViewModal(true);
                      if (!notif.is_read) {
                        await teacherAPI.markAdminNotificationAsRead(notif.id);
                        fetchAdminNotifications();
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            notif.type === 'announcement' ? 'bg-blue-100 text-blue-600' :
                            notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                            notif.type === 'info' ? 'bg-cyan-100 text-cyan-600' :
                            notif.type === 'update' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {notif.type === 'announcement' && <Bell className="w-5 h-5" />}
                            {notif.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                            {notif.type === 'info' && <Info className="w-5 h-5" />}
                            {notif.type === 'update' && <CheckCircle2 className="w-5 h-5" />}
                            {notif.type === 'reminder' && <AlertTriangle className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              {notif.title}
                              {!notif.is_read && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-primary-main text-white">
                                  New
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                              {notif.content.replace(/<[^>]*>/g, '')}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            notif.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            notif.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            notif.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notif.priority}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                          {notif.admin && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              From: {notif.admin.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Teacher's own notifications (existing code)
          <>
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
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
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Course Filter */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            {/* Published Filter */}
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications found</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Create your first notification to get started
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification, index) => (
                    <motion.tr
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getTypeBadgeColor(notification.type)}`}>
                            {getTypeIcon(notification.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {notification.content.replace(/<[^>]*>/g, '')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.course?.title || 'All Courses'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTogglePublish(notification)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            notification.published
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {notification.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{notification.read_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(notification)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(notification)}
                            className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
              >
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedNotification ? 'Edit Notification' : 'Create Notification'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      placeholder="Enter notification title"
                    />
                  </div>

                  {/* Content (Rich Text Editor) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content *
                    </label>
                    <div className="bg-white dark:bg-gray-700 rounded-lg">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        modules={quillModules}
                        className="h-48 mb-12"
                      />
                    </div>
                  </div>

                  {/* Type and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="alert">Alert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority *
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course (Optional)
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                    >
                      <option value="">All Courses</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Students Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipients (Students) *
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 max-h-48 overflow-y-auto bg-white dark:bg-gray-700">
                      {students.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                          No students available
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {/* Select All */}
                          <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.student_ids.length === students.length && students.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, student_ids: students.map(s => s.id) });
                                } else {
                                  setFormData({ ...formData, student_ids: [] });
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main focus:ring-2"
                            />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              Select All Students
                            </span>
                          </label>
                          <hr className="border-gray-200 dark:border-gray-600" />
                          {/* Individual Students */}
                          {students.map((student) => (
                            <label 
                              key={student.id} 
                              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formData.student_ids.includes(student.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({ 
                                      ...formData, 
                                      student_ids: [...formData.student_ids, student.id] 
                                    });
                                  } else {
                                    setFormData({ 
                                      ...formData, 
                                      student_ids: formData.student_ids.filter(id => id !== student.id) 
                                    });
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main focus:ring-2"
                              />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {student.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.student_ids.length > 0 && (
                      <p className="text-xs text-primary-main mt-2 font-medium">
                        ✓ {formData.student_ids.length} student(s) selected - Notification will be sent to these students
                      </p>
                    )}
                    {formData.student_ids.length === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                        ℹ️ No students selected - Notification will be sent to admin instead
                      </p>
                    )}
                  </div>

                  {/* Availability Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available From
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.available_from}
                        onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Until
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.available_until}
                        onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {selectedNotification ? 'Update' : 'Create'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {showViewModal && (selectedNotification || selectedAdminNotif) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowViewModal(false);
                setSelectedNotification(null);
                setSelectedAdminNotif(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedNotification?.title || selectedAdminNotif?.title}
                  </h2>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedNotification(null);
                      setSelectedAdminNotif(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedNotification 
                        ? getTypeBadgeColor(selectedNotification.type)
                        : selectedAdminNotif?.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                          selectedAdminNotif?.type === 'alert' ? 'bg-red-100 text-red-800' :
                          selectedAdminNotif?.type === 'info' ? 'bg-cyan-100 text-cyan-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedNotification?.type || selectedAdminNotif?.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedNotification
                        ? getPriorityBadgeColor(selectedNotification.priority)
                        : selectedAdminNotif?.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          selectedAdminNotif?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedAdminNotif?.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedNotification?.priority || selectedAdminNotif?.priority}
                    </span>
                    {selectedNotification?.published && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Published
                      </span>
                    )}
                    {selectedAdminNotif?.is_read && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Read
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedNotification?.content || selectedAdminNotif?.content || '' }}
                  />

                  {/* Meta Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedNotification?.course && (
                      <p>
                        <strong>Course:</strong> {selectedNotification.course.title}
                      </p>
                    )}
                    {selectedAdminNotif?.admin && (
                      <p>
                        <strong>From:</strong> {selectedAdminNotif.admin.name} (Admin)
                      </p>
                    )}
                    {(selectedNotification?.available_from || selectedAdminNotif?.published_at) && (
                      <p>
                        <strong>Available From:</strong>{' '}
                        {new Date(selectedNotification?.available_from || selectedAdminNotif?.published_at || '').toLocaleString()}
                      </p>
                    )}
                    {(selectedNotification?.available_until || selectedAdminNotif?.expires_at) && (
                      <p>
                        <strong>Available Until:</strong>{' '}
                        {new Date(selectedNotification?.available_until || selectedAdminNotif?.expires_at || '').toLocaleString()}
                      </p>
                    )}
                    <p>
                      <strong>Created:</strong> {new Date(selectedNotification?.created_at || selectedAdminNotif?.created_at || '').toLocaleString()}
                    </p>
                    {selectedNotification && (
                      <p>
                        <strong>Reads:</strong> {selectedNotification.read_count || 0}
                      </p>
                    )}
                    {selectedAdminNotif?.read_at && (
                      <p>
                        <strong>Read At:</strong> {new Date(selectedAdminNotif.read_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
          title={notificationToPublish?.published ? "Unpublish Notification" : "Publish Notification"}
          message={
            notificationToPublish?.published
              ? "Are you sure you want to unpublish this notification? Students will no longer see it."
              : "Are you sure you want to publish this notification? Students will be able to see it."
          }
          confirmText={notificationToPublish?.published ? "Unpublish" : "Publish"}
          confirmStyle={notificationToPublish?.published ? "warning" : "primary"}
        />
      </div>
    </TeacherLayout>
  );
};

export default Notifications;
