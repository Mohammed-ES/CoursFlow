import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen,
  Award, ClipboardCheck, TrendingUp, User
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';

interface StudentDetail {
  id: number;
  name: string;
  email: string;
  student_code: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  status: string;
  courses: Array<{
    id: number;
    title: string;
    subject: string;
    enrolled_at: string;
    progress: number;
  }>;
  overall_attendance_rate?: number;
  average_quiz_score?: number;
}

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getStudent(Number(id));
      setStudent(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (!student) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Student not found</p>
        </div>
      </TeacherLayout>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success-main';
    if (progress >= 50) return 'bg-warning-main';
    return 'bg-error-main';
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/teacher/students')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-main
            transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Students
        </motion.button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
            Student Details
          </h1>
          <p className="text-neutral-darkGray dark:text-neutral-gray">
            Detailed information about the student
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-main to-secondary-main
                  flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                  {student.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 mt-2 rounded-full text-xs font-medium
                  bg-success-light/20 text-success-main">
                  <span className="w-2 h-2 rounded-full bg-success-main"></span>
                  {student.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white">{student.email}</p>
                  </div>
                </div>

                {student.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-sm text-gray-900 dark:text-white">{student.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student Code</p>
                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {student.student_code}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Enrolled Courses */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Enrolled Courses
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {student.courses.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-light/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-main" />
                  </div>
                </div>
              </div>

              {/* Attendance Rate */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Attendance Rate
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {(student.overall_attendance_rate || 0).toFixed(0)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-success-light/20 flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-success-main" />
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Average Score
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {(student.average_quiz_score || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-warning-light/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-warning-main" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Enrolled Courses
              </h3>
              <div className="space-y-4">
                {student.courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4
                      hover:border-primary-main/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.subject}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`h-full ${getProgressColor(course.progress)} rounded-full`}
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default StudentDetails;
