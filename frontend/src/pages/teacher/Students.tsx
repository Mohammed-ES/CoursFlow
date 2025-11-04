import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Search, Download, Eye, Filter, 
  ChevronLeft, ChevronRight, BookOpen, Award, ClipboardCheck
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI from '../../services/teacherAPI';

interface Student {
  id: number;
  name: string;
  email: string;
  student_code: string;
  phone?: string;
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

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, [searchQuery, selectedCourse, currentPage]);

  // Fetch courses for filter
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        per_page: 15,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCourse !== 'all') params.course_id = selectedCourse;

      const response = await teacherAPI.getStudents(params);
      
      setStudents(response.data);
      setTotalPages(response.meta.last_page);
      setCurrentPage(response.meta.current_page);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await teacherAPI.getCourses({});
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      await teacherAPI.exportStudents({
        course_id: selectedCourse !== 'all' ? selectedCourse : undefined,
        search: searchQuery || undefined,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-success-main bg-success-light/20';
    if (rate >= 70) return 'text-warning-main bg-warning-light/20';
    return 'text-error-main bg-error-light/20';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-main';
    if (score >= 60) return 'text-warning-main';
    return 'text-error-main';
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
            Students Management
          </h1>
          <p className="text-neutral-darkGray dark:text-neutral-gray">
            View and manage enrolled students
          </p>
        </motion.div>

        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or student code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                    focus:ring-2 focus:ring-primary-main focus:border-transparent
                    dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>

            {/* Course Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:ring-2 focus:ring-primary-main focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-success-main text-white rounded-lg
                hover:bg-success-dark transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || selectedCourse !== 'all'
                  ? 'No students found matching your criteria'
                  : 'No students enrolled yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Score
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-main to-secondary-main
                            flex items-center justify-center text-white font-semibold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.courses.length} course{student.courses.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student Code */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded">
                          {student.student_code}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </td>

                      {/* Courses Count */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BookOpen className="w-4 h-4 text-primary-main" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.courses.length}
                          </span>
                        </div>
                      </td>

                      {/* Attendance Rate */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                          ${getAttendanceColor(student.overall_attendance_rate || 0)}`}>
                          <ClipboardCheck className="w-3 h-3" />
                          {(student.overall_attendance_rate || 0).toFixed(0)}%
                        </span>
                      </td>

                      {/* Average Quiz Score */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className={`w-4 h-4 ${getScoreColor(student.average_quiz_score || 0)}`} />
                          <span className={`text-sm font-medium ${getScoreColor(student.average_quiz_score || 0)}`}>
                            {(student.average_quiz_score || 0).toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => navigate(`/teacher/students/${student.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-primary-main hover:text-primary-dark
                            hover:bg-primary-light/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-sm"
          >
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default Students;
