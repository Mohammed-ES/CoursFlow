import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Mail,
  MailOpen,
  Trash2,
  Send,
  X,
  MessageSquare,
  Clock,
  CheckCheck,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Notification } from '../../types';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      senderId: 'T001',
      senderName: 'John Smith',
      recipientId: 'A001',
      message:
        'I need assistance with the new curriculum planning for Mathematics. Can we schedule a meeting?',
      read: false,
      createdAt: '2025-10-25T10:30:00Z',
      type: 'message',
    },
    {
      id: '2',
      senderId: 'T002',
      senderName: 'Sarah Johnson',
      recipientId: 'A001',
      message:
        'The Science lab equipment order has been approved. Please review the invoice.',
      read: false,
      createdAt: '2025-10-25T09:15:00Z',
      type: 'message',
    },
    {
      id: '3',
      senderId: 'T003',
      senderName: 'Michael Brown',
      recipientId: 'A001',
      message:
        'Student performance reports for English class are ready for your review.',
      read: true,
      createdAt: '2025-10-24T16:45:00Z',
      type: 'message',
    },
    {
      id: '4',
      senderId: 'T004',
      senderName: 'Emily Davis',
      recipientId: 'A001',
      message:
        'Requesting approval for the upcoming History field trip. Details attached.',
      read: true,
      createdAt: '2025-10-24T14:20:00Z',
      type: 'message',
    },
    {
      id: '5',
      senderId: 'T005',
      senderName: 'David Wilson',
      recipientId: 'A001',
      message:
        'Art supplies inventory is running low. Please review the requisition form.',
      read: true,
      createdAt: '2025-10-23T11:00:00Z',
      type: 'message',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'teachers'>(
    'all'
  );
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.senderName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterTab === 'all' ||
      (filterTab === 'unread' && !notification.read) ||
      (filterTab === 'teachers' && notification.type === 'message');

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleOpenNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleReply = () => {
    if (!replyMessage.trim()) return;
    
    // Simulate sending reply
    console.log('Sending reply:', replyMessage);
    setReplyMessage('');
    setSelectedNotification(null);
    
    // Show success message (you can add a toast here)
    alert('Reply sent successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              Manage communications with teachers
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-main to-accent-cyan text-white px-4 py-2 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="font-bold">{unreadCount} Unread</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                    filterTab === 'all'
                      ? 'bg-primary-main text-white'
                      : 'bg-neutral-offWhite dark:bg-secondary-dark text-neutral-darkGray dark:text-neutral-gray'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterTab('unread')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                    filterTab === 'unread'
                      ? 'bg-primary-main text-white'
                      : 'bg-neutral-offWhite dark:bg-secondary-dark text-neutral-darkGray dark:text-neutral-gray'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilterTab('teachers')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                    filterTab === 'teachers'
                      ? 'bg-primary-main text-white'
                      : 'bg-neutral-offWhite dark:bg-secondary-dark text-neutral-darkGray dark:text-neutral-gray'
                  }`}
                >
                  Teachers
                </button>
              </div>

              {/* Notifications List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleOpenNotification(notification)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      !notification.read
                        ? 'bg-primary-main/10 border-2 border-primary-main/30'
                        : 'bg-neutral-offWhite dark:bg-secondary-dark border-2 border-transparent'
                    } ${
                      selectedNotification?.id === notification.id
                        ? 'ring-2 ring-primary-main'
                        : ''
                    } hover:shadow-md`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {notification.senderName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-secondary-main dark:text-white truncate">
                            {notification.senderName}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-main rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-neutral-gray line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-1 mt-2">
                          <Clock className="w-3 h-3 text-neutral-gray" />
                          <span className="text-xs text-neutral-gray">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Notification Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              {selectedNotification ? (
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-lightGray dark:border-secondary-main">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {selectedNotification.senderName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-secondary-main dark:text-white mb-1">
                          {selectedNotification.senderName}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-neutral-gray">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatDate(selectedNotification.createdAt)}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            {selectedNotification.read ? (
                              <>
                                <CheckCheck className="w-4 h-4" />
                                <span>Read</span>
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4" />
                                <span>Unread</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedNotification.read ? (
                        <button
                          onClick={() =>
                            handleMarkAsUnread(selectedNotification.id)
                          }
                          className="p-2 hover:bg-neutral-offWhite dark:hover:bg-secondary-dark rounded-lg transition-colors"
                          title="Mark as unread"
                        >
                          <Mail className="w-5 h-5 text-neutral-gray" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleMarkAsRead(selectedNotification.id)
                          }
                          className="p-2 hover:bg-neutral-offWhite dark:hover:bg-secondary-dark rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <MailOpen className="w-5 h-5 text-neutral-gray" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selectedNotification.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                      <button
                        onClick={() => setSelectedNotification(null)}
                        className="p-2 hover:bg-neutral-offWhite dark:hover:bg-secondary-dark rounded-lg transition-colors"
                        title="Close"
                      >
                        <X className="w-5 h-5 text-neutral-gray" />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-br from-primary-main/5 to-accent-cyan/5 p-6 rounded-xl">
                      <p className="text-secondary-main dark:text-white leading-relaxed">
                        {selectedNotification.message}
                      </p>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div>
                    <label className="block text-sm font-bold text-secondary-main dark:text-white mb-3">
                      Reply to {selectedNotification.senderName}
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={5}
                      className="w-full p-4 bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white resize-none"
                    />
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={handleReply}
                        variant="primary"
                        className="flex items-center space-x-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>Send Reply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px]">
                  <MessageSquare className="w-24 h-24 text-neutral-gray mb-4" />
                  <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-2">
                    No Message Selected
                  </h3>
                  <p className="text-neutral-gray text-center max-w-md">
                    Select a notification from the list to view and reply to
                    messages from teachers
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
