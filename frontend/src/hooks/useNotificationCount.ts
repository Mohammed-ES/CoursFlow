import { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';

interface NotificationCount {
  total: number;
  admin_notifications: number;
  student_notifications: number;
}

export const useNotificationCount = (refreshInterval: number = 30000) => {
  const [count, setCount] = useState<NotificationCount>({
    total: 0,
    admin_notifications: 0,
    student_notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.role) {
        setLoading(false);
        return;
      }

      let endpoint = '';
      
      switch (user.role) {
        case 'teacher':
          endpoint = '/teachers/notifications/unread-count';
          break;
        case 'student':
          endpoint = '/students/notifications/unread-count';
          break;
        default:
          setLoading(false);
          return;
      }

      console.log('🔔 Fetching notification count from:', endpoint);
      const response = await api.get(endpoint);
      console.log('🔔 Response:', response.data);
      
      // Handle different response formats
      if (user.role === 'student' && response.data.success) {
        // Student API format: { success: true, data: { unread_count: X } }
        setCount({
          total: response.data.data.unread_count,
          admin_notifications: 0,
          student_notifications: 0,
        });
      } else if (user.role === 'teacher') {
        // Teacher API format: { total: X, admin_notifications: Y, student_notifications: Z }
        setCount(response.data);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('❌ Failed to fetch notification count:', err);
      console.error('❌ Error details:', err.response?.data);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    
    // Auto-refresh every X seconds
    const interval = setInterval(fetchCount, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchCount, refreshInterval]);

  const refresh = () => {
    fetchCount();
  };

  return { count, loading, error, refresh };
};
