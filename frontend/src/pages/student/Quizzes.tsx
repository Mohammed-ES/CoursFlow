import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Play,
  Search,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI, { Quiz } from '../../services/studentAPI';
import { Link } from 'react-router-dom';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'completed'>('all');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getQuizzes();
      console.log('Quizzes API response:', response);
      console.log('Quizzes data:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      setQuizzes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof quiz.course === 'string' && quiz.course.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'available' && quiz.can_retake) ||
      (filterStatus === 'completed' && (quiz.attempts_count || 0) > 0 && !quiz.can_retake);

    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (score: number, totalMarks: number): string => {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number, totalMarks: number): string => {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (percentage >= 60) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    if (percentage >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  if (loading) {
    return (
      <StudentLayout title="My Quizzes" subtitle="Test your knowledge and track your progress">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Quizzes" subtitle="Test your knowledge and track your progress">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{quizzes.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {quizzes.filter((q) => (q.attempts_count || 0) > 0).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {quizzes.filter((q) => q.best_score !== null).length > 0
                    ? Math.round(
                        quizzes
                          .filter((q) => q.best_score !== null)
                          .reduce((sum, q) => sum + (q.best_score || 0) / q.total_marks * 100, 0) /
                          quizzes.filter((q) => q.best_score !== null).length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {quizzes.filter((q) => q.best_score !== null).length > 0
                    ? Math.max(
                        ...quizzes
                          .filter((q) => q.best_score !== null)
                          .map((q) => Math.round(((q.best_score || 0) / q.total_marks) * 100))
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available' | 'completed')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">All Quizzes</option>
              <option value="available">Available</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </motion.div>

        {/* Quizzes List */}
        {filteredQuizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Quizzes Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Enroll in courses to access quizzes'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-all ${
                  quiz.best_score !== null && quiz.best_score !== undefined
                    ? getScoreBgColor(quiz.best_score, quiz.total_marks)
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="p-6">
                  {/* Quiz Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {typeof quiz.course === 'string' ? quiz.course : 'Course'}
                      </p>
                    </div>
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${
                        quiz.can_retake
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {quiz.can_retake ? (
                        <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Quiz Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2 text-primary-main" />
                      <span className="text-sm">{quiz.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Award className="w-4 h-4 mr-2 text-primary-main" />
                      <span className="text-sm">{quiz.total_marks} points</span>
                    </div>
                  </div>

                  {/* Attempts & Score */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Attempts:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {quiz.attempts_count || 0} / {quiz.attempts_remaining || '∞'}
                      </span>
                    </div>
                    {quiz.best_score !== null && quiz.best_score !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Best Score:</span>
                        <span className={`font-bold text-lg ${getScoreColor(quiz.best_score, quiz.total_marks)}`}>
                          {quiz.best_score} / {quiz.total_marks}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {quiz.can_retake ? (
                    <Link
                      to={`/student/quizzes/${quiz.id}/attempt`}
                      className="block w-full py-3 px-4 bg-gradient-to-r from-primary-main to-primary-dark hover:from-primary-dark hover:to-primary-main text-white font-semibold rounded-lg text-center transition-all transform hover:scale-105"
                    >
                      {(quiz.attempts_count || 0) === 0 ? 'Start Quiz' : 'Retake Quiz'}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed"
                    >
                      No Attempts Remaining
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {quiz.best_score !== null && quiz.best_score !== undefined && (
                  <div className="h-2 bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full transition-all duration-500 ${
                        (quiz.best_score / quiz.total_marks) * 100 >= 80
                          ? 'bg-green-500'
                          : (quiz.best_score / quiz.total_marks) * 100 >= 60
                          ? 'bg-blue-500'
                          : (quiz.best_score / quiz.total_marks) * 100 >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${(quiz.best_score / quiz.total_marks) * 100}%` }}
                    ></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Quizzes;
