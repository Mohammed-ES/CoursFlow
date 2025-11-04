export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  password?: string;
  firstLoginDate: string;
  lastLogoutDate: string;
  status: 'active' | 'inactive' | 'suspended';
  enrolledCourses?: number;
  avatar?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  password?: string;
  subject: string;
  specialization?: string;
  experience?: number;
  status: 'active' | 'inactive';
  studentsCount?: number;
  coursesCount?: number;
  avatar?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
}

export interface Notification {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'message';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructor: string;
  duration: string;
  lessons: number;
  enrolled: number;
  rating: number;
  image?: string;
  category: string;
  price?: number;
  isFeatured?: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  completed: boolean;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  courseName?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  courseId?: string;
  type: 'class' | 'exam' | 'assignment' | 'event';
  location?: string;
}

export interface Progress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  lastAccessedAt: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  upcomingClasses: number;
  totalHours: number;
}
