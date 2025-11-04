// Notification service for real-time notifications from database
// This service will be replaced with actual API calls when backend is ready

export interface Notification {
  id: number;
  recipient_type: 'admin' | 'student' | 'teacher';
  recipient_id: number;
  type: 'message' | 'payment' | 'enrollment' | 'system';
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

class NotificationService {
  // Mock data - Replace with actual API calls
  private mockNotifications: Notification[] = [
    {
      id: 1,
      recipient_type: 'admin',
      recipient_id: 1,
      type: 'message',
      title: 'Nouveau message de Michael Chen',
      message: 'Pourrions-nous organiser une session de révision...',
      link: '/admin/messages',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      recipient_type: 'admin',
      recipient_id: 1,
      type: 'payment',
      title: 'Nouveau paiement reçu',
      message: 'Paiement de 150.00 DH pour le cours React Avancé',
      link: '/admin/payments',
      is_read: false,
      created_at: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 3,
      recipient_type: 'admin',
      recipient_id: 1,
      type: 'enrollment',
      title: 'Nouvelle inscription',
      message: 'Alice Johnson s\'est inscrite au cours Python',
      link: '/admin/students',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 4,
      recipient_type: 'admin',
      recipient_id: 1,
      type: 'system',
      title: 'Mise à jour système',
      message: 'Le système a été mis à jour vers la version 2.1.0',
      link: null,
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  /**
   * Get all notifications for a user
   * @param userId User ID
   * @param userType Type of user (admin, student, teacher)
   * @returns Promise<Notification[]>
   */
  async getNotifications(userId: number, userType: 'admin' | 'student' | 'teacher'): Promise<Notification[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/notifications?user_id=${userId}&user_type=${userType}`);
    // return response.json();

    // Load from localStorage if available
    const stored = localStorage.getItem(`notifications_${userType}_${userId}`);
    if (stored) {
      this.mockNotifications = JSON.parse(stored);
    }

    return this.mockNotifications.filter(
      (n) => n.recipient_id === userId && n.recipient_type === userType
    );
  }

  /**
   * Get unread notification count
   * @param userId User ID
   * @param userType Type of user
   * @returns Promise<number>
   */
  async getUnreadCount(userId: number, userType: 'admin' | 'student' | 'teacher'): Promise<number> {
    const notifications = await this.getNotifications(userId, userType);
    return notifications.filter((n) => !n.is_read).length;
  }

  /**
   * Mark notification as read
   * @param notificationId Notification ID
   * @returns Promise<void>
   */
  async markAsRead(notificationId: number): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // TODO: Replace with actual API call
    // await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' });

    // Update in mock data
    const index = this.mockNotifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      this.mockNotifications[index].is_read = true;
      
      // Save to localStorage
      const userId = this.mockNotifications[index].recipient_id;
      const userType = this.mockNotifications[index].recipient_type;
      localStorage.setItem(
        `notifications_${userType}_${userId}`,
        JSON.stringify(this.mockNotifications)
      );
    }
  }

  /**
   * Mark all notifications as read
   * @param userId User ID
   * @param userType Type of user
   * @returns Promise<void>
   */
  async markAllAsRead(userId: number, userType: 'admin' | 'student' | 'teacher'): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // TODO: Replace with actual API call
    // await fetch(`/api/notifications/read-all?user_id=${userId}&user_type=${userType}`, { method: 'PUT' });

    // Update in mock data
    this.mockNotifications = this.mockNotifications.map((n) => {
      if (n.recipient_id === userId && n.recipient_type === userType) {
        return { ...n, is_read: true };
      }
      return n;
    });

    // Save to localStorage
    localStorage.setItem(
      `notifications_${userType}_${userId}`,
      JSON.stringify(this.mockNotifications)
    );
  }

  /**
   * Delete a notification
   * @param notificationId Notification ID
   * @returns Promise<void>
   */
  async deleteNotification(notificationId: number): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // TODO: Replace with actual API call
    // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });

    // Remove from mock data
    const notification = this.mockNotifications.find((n) => n.id === notificationId);
    if (notification) {
      this.mockNotifications = this.mockNotifications.filter((n) => n.id !== notificationId);
      
      // Save to localStorage
      const userId = notification.recipient_id;
      const userType = notification.recipient_type;
      localStorage.setItem(
        `notifications_${userType}_${userId}`,
        JSON.stringify(this.mockNotifications)
      );
    }
  }

  /**
   * Get notification icon based on type
   * @param type Notification type
   * @returns Icon name
   */
  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      message: '💬',
      payment: '💰',
      enrollment: '📚',
      system: '⚙️',
    };
    return icons[type] || '🔔';
  }

  /**
   * Get notification color based on type
   * @param type Notification type
   * @returns Tailwind color class
   */
  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      message: 'from-blue-500 to-cyan-500',
      payment: 'from-green-500 to-emerald-500',
      enrollment: 'from-purple-500 to-pink-500',
      system: 'from-gray-500 to-slate-500',
    };
    return colors[type] || 'from-gray-500 to-slate-500';
  }
}

export const notificationService = new NotificationService();
