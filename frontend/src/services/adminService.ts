// Admin Service - Handles all admin-related data fetching
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalRevenue: number;
  revenueGrowth: number;
  studentsGrowth: number;
  teachersGrowth: number;
  coursesGrowth: number;
}

interface PaymentStats {
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
}

interface Payment {
  id: number;
  transaction_id: string;
  student_id: number;
  student_name: string;
  student_avatar?: string;
  course_id: number;
  course_name: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
  payment_date: string;
}

interface RecentActivity {
  id: string | number;
  type: 'enrollment' | 'payment' | 'completion';
  student_name: string;
  course_name: string;
  timestamp: string;
  details: string;
}

// Service connected to real API
class AdminService {
  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Payment Statistics
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/payments/stats`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  // All Payments
  async getAllPayments(): Promise<Payment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/payments`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Recent Activities - Connected to real API
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/activities`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
export type { DashboardStats, PaymentStats, Payment, RecentActivity };
