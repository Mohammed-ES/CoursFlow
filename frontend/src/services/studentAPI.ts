import axios from '../utils/axios';

// ============ TYPES & INTERFACES ============

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  duration_hours: number;
  teacher: {
    id: number;
    name: string;
    email: string;
  };
  progress: number;
  enrolled_at: string;
  last_accessed_at?: string;
  file_urls?: {
    pdf?: string;
    images?: string[];
    videos?: string[];
  };
  lessons?: Lesson[];
  quizzes?: Quiz[];
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  content?: string;
  order: number;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  course?: string;
  teacher?: string;
  duration_minutes: number;
  total_marks: number;
  passing_score?: number;
  attempts_count?: number;
  best_score?: number;
  can_retake?: boolean;
  questions?: QuizQuestion[];
  instructions?: string;
  attempts_remaining?: string | number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  points: number;
}

export interface QuizSubmission {
  answers: {
    question_id: number;
    answer: string;
  }[];
  time_spent_seconds?: number;
}

export interface QuizResult {
  attempt_id: number;
  score: number;
  correct_count: number;
  total_questions: number;
  passed: boolean;
  feedback: QuestionFeedback[];
  general_feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  corrected_by: string;
}

export interface QuestionFeedback {
  question_number: number;
  is_correct: boolean;
  points_earned: number;
  correct_answer: string;
  student_answer: string;
  explanation: string;
  improvement_tip: string;
}

export interface QuizAttempt {
  id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  submitted_at: string;
  time_spent: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority?: string;
  read_at?: string;
  created_at: string;
  published_at?: string;
  course?: {
    id: number;
    title: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  type: string;
  start: string;
  end: string;
  location?: string;
  is_personal: boolean;
  course?: string;
  teacher?: string;
  color: string;
}

export interface DashboardStats {
  totalCourses: number;
  avgProgress: number;
  unreadNotifications: number;
  avgQuizScore: number;
  recentCourses: any[];
  upcomingEvents: any[];
  recentQuizzes: any[];
}

export interface StudentProfile {
  id: number;
  user_id: number;
  name: string;
  email: string;
  student_code: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  profile_image?: string;
  status: string;
}

// ============ API SERVICE ============

const studentAPI = {
  // ==================== DASHBOARD ====================
  /**
   * Get student dashboard statistics
   */
  getDashboard: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const response = await axios.get('/student/dashboard');
    return response.data;
  },

  // ==================== PROFILE ====================
  /**
   * Get student profile
   */
  getProfile: async (): Promise<{ success: boolean; data: StudentProfile }> => {
    const response = await axios.get('/student/profile');
    return response.data;
  },

  /**
   * Update student profile
   */
  updateProfile: async (data: FormData): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await axios.post('/student/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ==================== COURSES ====================
  /**
   * Get all paid courses for student
   */
  getCourses: async (params?: {
    search?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
  }): Promise<any> => {
    const response = await axios.get('/student/courses', { params });
    return response.data;
  },

  /**
   * Get course details with lessons and files
   */
  getCourseDetails: async (id: number): Promise<{ success: boolean; data: Course }> => {
    const response = await axios.get(`/student/courses/${id}`);
    return response.data;
  },

  /**
   * Update course progress
   */
  updateCourseProgress: async (courseId: number, progress: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`/student/courses/${courseId}/progress`, { progress });
    return response.data;
  },

  /**
   * Download course file
   */
  downloadCourseFile: async (courseId: number, fileType: string): Promise<Blob> => {
    const response = await axios.get(`/student/courses/${courseId}/download/${fileType}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ==================== QUIZZES ====================
  /**
   * Get all available quizzes for student
   */
  getQuizzes: async (): Promise<{ success: boolean; data: Quiz[] }> => {
    const response = await axios.get('/student/quizzes');
    return response.data;
  },

  /**
   * Get quiz details with questions
   */
  getQuizDetails: async (id: number): Promise<{ success: boolean; data: Quiz }> => {
    const response = await axios.get(`/student/quizzes/${id}`);
    return response.data;
  },

  /**
   * Submit quiz answers for AI correction using Gemini API
   */
  submitQuiz: async (quizId: number, answers: Record<number, string>, timeSpent: number): Promise<{ success: boolean; data: QuizResult }> => {
    const response = await axios.post('/student/analyze-quiz', {
      quiz_id: quizId,
      answers,
      time_spent: timeSpent
    });
    return response.data;
  },

  /**
   * Get quiz attempt history
   */
  getQuizAttempts: async (quizId: number): Promise<{ success: boolean; data: QuizAttempt[] }> => {
    const response = await axios.get(`/student/quizzes/${quizId}/attempts`);
    return response.data;
  },

  // ==================== NOTIFICATIONS ====================
  /**
   * Get student notifications
   */
  getNotifications: async (params?: {
    status?: 'read' | 'unread';
    type?: string;
    per_page?: number;
    page?: number;
  }): Promise<any> => {
    const response = await axios.get('/student/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`/student/notifications/${id}/mark-read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post('/student/notifications/mark-all-read');
    return response.data;
  },

  /**
   * Delete notification
   */
  deleteNotification: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/student/notifications/${id}`);
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadNotificationCount: async (): Promise<{ success: boolean; data: { unread_count: number } }> => {
    const response = await axios.get('/student/notifications/unread-count');
    return response.data;
  },

  // ==================== CALENDAR ====================
  /**
   * Get calendar events
   */
  getCalendarEvents: async (params?: {
    start?: string;
    end?: string;
    type?: string;
  }): Promise<{ success: boolean; data: CalendarEvent[] }> => {
    const response = await axios.get('/student/calendar', { params });
    return response.data;
  },

  /**
   * Create personal calendar event
   */
  createCalendarEvent: async (data: {
    title: string;
    description?: string;
    type: string;
    start_date: string;
    end_date: string;
    location?: string;
  }): Promise<{ success: boolean; message: string; data: CalendarEvent }> => {
    const response = await axios.post('/student/calendar', data);
    return response.data;
  },

  /**
   * Update personal calendar event
   */
  updateCalendarEvent: async (
    id: number,
    data: {
      title?: string;
      description?: string;
      type?: string;
      start_date?: string;
      end_date?: string;
      location?: string;
    }
  ): Promise<{ success: boolean; message: string; data: CalendarEvent }> => {
    const response = await axios.put(`/student/calendar/${id}`, data);
    return response.data;
  },

  /**
   * Delete personal calendar event
   */
  deleteCalendarEvent: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/student/calendar/${id}`);
    return response.data;
  },
};

export default studentAPI;
