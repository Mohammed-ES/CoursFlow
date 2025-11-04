import axios from '../utils/axios';

// Types
export interface Teacher {
  id: number;
  user_id: number;
  name: string;
  email: string;
  subject: string;
  bio: string;
  phone: string;
  profile_image: string | null;
  specialization: string;
  years_of_experience: number;
  status: 'active' | 'inactive' | 'on_leave';
}

export interface DashboardStats {
  totalStudents: number;
  publishedCourses: number;
  draftCourses?: number;
  archivedCourses?: number;
  attendanceRate: number;
  averageQuizScore: number;
  recentStudents: any[];
  topCourses?: Array<{
    title: string;
    enrolled: number;
  }>;
  attendanceTrend: Array<{
    date: string;
    present: number;
    absent: number;
  }>;
}

export interface Student {
  id: number;
  student_code: string;
  name: string;
  email: string;
  profile_image: string | null;
  courses: any[];
  overall_attendance_rate: number;
  average_quiz_score: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  duration_hours: number;
  max_students: number;
  thumbnail: string | null;
  status: 'draft' | 'published' | 'archived';
  start_date: string | null;
  end_date: string | null;
  enrolled_count: number;
  is_full: boolean;
  materials_count: number;
  materials?: CourseMaterial[];
  created_at: string;
}

export interface CourseMaterial {
  id: number;
  title: string;
  description: string | null;
  file_type: 'pdf' | 'image' | 'video';
  file_name: string;
  file_size: number;
  file_size_human: string;
  file_icon: string;
  downloads_count: number;
  is_public: boolean;
  order: number;
  created_at: string;
}

export interface Attendance {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time: string | null;
  notes: string | null;
  student: {
    id: number;
    name: string;
    student_code: string;
    profile_image: string | null;
  };
  course: {
    id: number;
    title: string;
    subject: string;
  };
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  is_ai_generated: boolean;
  is_available: boolean;
  available_from: string | null;
  available_until: string | null;
  questions_count: number;
  results_count: number;
  average_score: number;
  completion_rate: number;
  course: {
    id: number;
    title: string;
  };
  questions?: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  points: number;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'announcement' | 'reminder' | 'alert' | 'info';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_published: boolean;
  published_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  course: {
    id: number;
    title: string;
  } | null;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string;
  type: 'class' | 'exam' | 'meeting' | 'reminder' | 'holiday';
  location: string | null;
  color: string;
  is_recurring: boolean;
  recurring_pattern: 'daily' | 'weekly' | 'monthly' | null;
  duration_minutes: number;
  course: {
    id: number;
    title: string;
  } | null;
}

// API Methods
const teacherAPI = {
  // Dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await axios.get('/teachers/dashboard');
    return response.data.data || response.data;
  },

  // Students
  getStudents: async (params?: {
    search?: string;
    course_id?: number;
    per_page?: number;
    page?: number;
  }): Promise<{ data: Student[]; meta: any }> => {
    const response = await axios.get('/teachers/students', { params });
    return response.data;
  },

  getStudent: async (id: number): Promise<{ data: Student }> => {
    const response = await axios.get(`/teachers/students/${id}`);
    return response.data;
  },

  exportStudents: async (params?: {
    course_id?: string | number;
    search?: string;
  }): Promise<void> => {
    const response = await axios.get('/teachers/students/export', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Courses
  getCourses: async (params?: {
    status?: string;
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<{ data: Course[]; meta: any }> => {
    const response = await axios.get('/teachers/courses', { params });
    return response.data;
  },

  getCourse: async (id: number): Promise<Course> => {
    const response = await axios.get(`/teachers/courses/${id}`);
    return response.data;
  },

  createCourse: async (data: Partial<Course>): Promise<Course> => {
    const response = await axios.post('/teachers/courses', data);
    return response.data.course;
  },

  updateCourse: async (id: number, data: Partial<Course>): Promise<Course> => {
    const response = await axios.put(`/teachers/courses/${id}`, data);
    return response.data.course;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await axios.delete(`/teachers/courses/${id}`);
  },

  // Course Materials
  uploadMaterial: async (
    courseId: number,
    data: FormData
  ): Promise<CourseMaterial> => {
    const response = await axios.post(
      `/teachers/courses/${courseId}/materials`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.material;
  },

  deleteMaterial: async (courseId: number, materialId: number): Promise<void> => {
    await axios.delete(`/teachers/courses/${courseId}/materials/${materialId}`);
  },

  downloadMaterial: async (courseId: number, materialId: number): Promise<Blob> => {
    const response = await axios.get(
      `/teachers/courses/${courseId}/materials/${materialId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Aliases pour la compatibilité
  getCourseMaterials: async (courseId: number): Promise<{ data: CourseMaterial[] }> => {
    const response = await axios.get(`/teachers/courses/${courseId}/materials`);
    // Le backend retourne directement un tableau, on l'enveloppe dans { data: [] }
    return { data: Array.isArray(response.data) ? response.data : [] };
  },

  uploadCourseMaterial: async (courseId: number, data: FormData): Promise<CourseMaterial> => {
    const response = await axios.post(
      `/teachers/courses/${courseId}/materials`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.material;
  },

  deleteCourseMaterial: async (courseId: number, materialId: number): Promise<void> => {
    await axios.delete(`/teachers/courses/${courseId}/materials/${materialId}`);
  },

  // Attendance
  getAttendance: async (params?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    course_id?: number;
    student_id?: number;
    status?: string;
    per_page?: number;
    page?: number;
  }): Promise<{ data: Attendance[]; meta: any }> => {
    const response = await axios.get('/teachers/attendance', { params });
    return response.data;
    return response.data;
  },

  markAttendance: async (data: {
    course_id: number;
    student_id: number;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
    check_in_time?: string;
  }): Promise<Attendance> => {
    const response = await axios.post('/teachers/attendance', data);
    return response.data.attendance;
  },

  bulkMarkAttendance: async (data: {
    course_id: number;
    date: string;
    attendances: Array<{
      student_id: number;
      status: 'present' | 'absent' | 'late' | 'excused';
      notes?: string;
    }>;
  }): Promise<{ successful_count: number; error_count: number; errors: string[] }> => {
    const response = await axios.post('/teachers/attendance/bulk', data);
    return response.data;
  },

  getAttendanceStatistics: async (
    courseId: number,
    params?: { start_date?: string; end_date?: string }
  ): Promise<any> => {
    const response = await axios.get(`/teachers/attendance/statistics/${courseId}`, {
      params,
    });
    return response.data;
  },

  exportAttendance: async (params?: {
    start_date?: string;
    end_date?: string;
    course_id?: number;
  }): Promise<Blob> => {
    const response = await axios.get('/teachers/attendance/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Quizzes
  getQuizzes: async (params?: {
    course_id?: number;
    status?: string;
    is_ai_generated?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<{ data: Quiz[]; meta: any }> => {
    const response = await axios.get('/teachers/quizzes', { params });
    return response.data;
  },

  getQuiz: async (id: number): Promise<Quiz> => {
    const response = await axios.get(`/teachers/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (data: Partial<Quiz>): Promise<Quiz> => {
    const response = await axios.post('/teachers/quizzes', data);
    return response.data.quiz;
  },

  updateQuiz: async (id: number, data: Partial<Quiz>): Promise<Quiz> => {
    const response = await axios.put(`/teachers/quizzes/${id}`, data);
    return response.data.quiz;
  },

  deleteQuiz: async (id: number): Promise<void> => {
    await axios.delete(`/teachers/quizzes/${id}`);
  },

  // AI Quiz Generation
  generateQuizWithAI: async (data: {
    course_id: number;
    topic: string;
    num_questions: number;
    difficulty: 'easy' | 'medium' | 'hard';
    question_types: Array<'multiple_choice' | 'true_false'>;
  }): Promise<{ quiz_data: Partial<Quiz> }> => {
    const response = await axios.post('/teachers/quizzes/generate-ai', data);
    return response.data;
  },

  saveAIQuiz: async (data: Partial<Quiz>): Promise<Quiz> => {
    const response = await axios.post('/teachers/quizzes/save-ai', data);
    return response.data.quiz;
  },

  getQuizResults: async (id: number): Promise<any> => {
    const response = await axios.get(`/teachers/quizzes/${id}/results`);
    return response.data;
  },

  // Notifications
  getNotifications: async (params?: {
    course_id?: number | string;
    type?: string;
    is_published?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<{ data: Notification[]; meta: any }> => {
    const response = await axios.get('/teachers/notifications', { params });
    return response.data;
  },

  getNotification: async (id: number): Promise<Notification> => {
    const response = await axios.get(`/teachers/notifications/${id}`);
    return response.data;
  },

  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    const response = await axios.post('/teachers/notifications', data);
    return response.data.notification;
  },

  updateNotification: async (
    id: number,
    data: Partial<Notification>
  ): Promise<Notification> => {
    const response = await axios.put(`/teachers/notifications/${id}`, data);
    return response.data.notification;
  },

  deleteNotification: async (id: number): Promise<void> => {
    await axios.delete(`/teachers/notifications/${id}`);
  },

  publishNotification: async (id: number): Promise<Notification> => {
    const response = await axios.post(`/teachers/notifications/${id}/publish`);
    return response.data.notification;
  },

  unpublishNotification: async (id: number): Promise<Notification> => {
    const response = await axios.post(`/teachers/notifications/${id}/unpublish`);
    return response.data.notification;
  },

  // Admin Notifications (Received from admin)
  getAdminNotifications: async (params?: {
    type?: string;
    priority?: string;
    unread_only?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<{ data: any[]; meta: any }> => {
    const response = await axios.get('/teachers/admin-notifications', { params });
    return response.data;
  },

  markAdminNotificationAsRead: async (id: number): Promise<void> => {
    await axios.post(`/teachers/admin-notifications/${id}/mark-read`);
  },

  // Calendar Events
  getCalendarEvents: async (params?: {
    start?: string;
    end?: string;
    course_id?: number | string;
    type?: string;
  }): Promise<CalendarEvent[]> => {
    const response = await axios.get('/teachers/calendar', { params });
    return response.data;
  },

  getCalendarEvent: async (id: number): Promise<CalendarEvent> => {
    const response = await axios.get(`/teachers/calendar/${id}`);
    return response.data;
  },

  createCalendarEvent: async (data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const response = await axios.post('/teachers/calendar', data);
    return response.data.event;
  },

  updateCalendarEvent: async (
    id: number,
    data: Partial<CalendarEvent>
  ): Promise<CalendarEvent> => {
    const response = await axios.put(`/teachers/calendar/${id}`, data);
    return response.data.event;
  },

  deleteCalendarEvent: async (id: number): Promise<void> => {
    await axios.delete(`/teachers/calendar/${id}`);
  },

  getUpcomingEvents: async (limit?: number): Promise<CalendarEvent[]> => {
    const response = await axios.get('/teachers/calendar/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  // Reports
  getReports: async (params: {
    type: string;
    from_date: string;
    to_date: string;
    course_id?: string;
  }): Promise<any> => {
    const response = await axios.get('/teachers/reports', { params });
    return response;
  },

  // Profile
  getProfile: async (): Promise<any> => {
    const response = await axios.get('/teachers/profile');
    return response;
  },

  updateProfile: async (data: any): Promise<any> => {
    const response = await axios.put('/teachers/profile', data);
    return response;
  },

  uploadProfilePhoto: async (formData: FormData): Promise<any> => {
    const response = await axios.post('/teachers/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<any> => {
    const response = await axios.put('/teachers/profile/password', data);
    return response;
  },
};

export default teacherAPI;
