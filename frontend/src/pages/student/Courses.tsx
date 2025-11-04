import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, TrendingUp, Clock, User } from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI, { Course } from '../../services/studentAPI';
import { Link } from 'react-router-dom';

const StudentCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('enrolled_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, sortBy, sortOrder, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getCourses({
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: currentPage,
        per_page: 12,
      });

      setCourses(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <StudentLayout title="My Courses" subtitle="Access your enrolled courses and track your progress">
      <div className="space-y-6">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-main"
              >
                <option value="enrolled_at">Enrollment Date</option>
                <option value="progress">Progress</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
          </div>
        ) : courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700"
          >
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'You are not enrolled in any courses yet'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Course Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-main to-secondary-main">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      {/* Progress Badge */}
                      <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {course.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Teacher Info */}
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <User className="w-4 h-4 mr-2" />
                        <span>{course.teacher.name}</span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{course.duration_hours} hours</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(course.progress)} transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-primary-main hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Continue Learning
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary-main text-white border-primary-main'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentCourses;
