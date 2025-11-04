import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Bell,
  Award,
  Calendar as CalendarIcon,
  ArrowRight,
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import studentAPI, { DashboardStats } from '../../services/studentAPI';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getDashboard();
      const data = response.data || response;
      
      console.log('=== DASHBOARD DEBUG ===');
      console.log('Full API response:', response);
      console.log('Data object:', data);
      console.log('Recent courses:', data.recentCourses);
      console.log('Upcoming events:', data.upcomingEvents);
      console.log('Events count:', data.upcomingEvents?.length);
      
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Dashboard" subtitle="Welcome back! Here's your overview">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </StudentLayout>
    );
  }

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      change: '+2 new',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Average Progress',
      value: `${stats?.avgProgress?.toFixed(0) || 0}%`,
      change: '+5%',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Notifications',
      value: stats?.unreadNotifications || 0,
      change: 'Unread',
      icon: Bell,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Avg Quiz Score',
      value: `${stats?.avgQuizScore?.toFixed(0) || 0}%`,
      change: '+3%',
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Progress Chart Data
  const progressData = {
    labels: stats?.recentCourses?.map((c) => c.title.substring(0, 15) + '...') || [],
    datasets: [
      {
        label: 'Course Progress (%)',
        data: stats?.recentCourses?.map((c) => c.progress) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  console.log('=== CHART DEBUG ===');
  console.log('Recent courses for chart:', stats?.recentCourses);
  console.log('Chart labels:', progressData.labels);
  console.log('Chart data:', progressData.datasets[0].data);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark')
            ? 'rgba(75, 85, 99, 0.3)'
            : 'rgba(229, 231, 235, 0.8)',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <StudentLayout title="Dashboard" subtitle="Welcome back! Here's your overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full`}
                  ></div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {card.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Course Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your progress in recent courses
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-72">
              {stats?.recentCourses && stats.recentCourses.length > 0 ? (
                <Line data={progressData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No courses enrolled yet</p>
                    <Link 
                      to="/student/courses"
                      className="text-sm text-primary-main hover:text-primary-dark mt-2 inline-block"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Courses</h3>
              <Link
                to="/student/courses"
                className="text-sm text-primary-main hover:text-primary-dark transition-colors flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {stats?.recentCourses?.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{course.teacher}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-main">{course.progress}%</p>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                        <div
                          className="h-full bg-primary-main rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Upcoming Events & Recent Quizzes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
              </div>
              <Link
                to="/student/calendar"
                className="text-sm text-primary-main hover:text-primary-dark transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.upcomingEvents?.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 mr-3`}
                    style={{ backgroundColor: event.color || '#3B82F6' }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(event.start_date).toLocaleDateString()} at{' '}
                      {new Date(event.start_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.upcomingEvents || stats.upcomingEvents.length === 0) && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </motion.div>

          {/* Recent Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Quizzes</h3>
              </div>
              <Link
                to="/student/quizzes"
                className="text-sm text-primary-main hover:text-primary-dark transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentQuizzes?.slice(0, 4).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {quiz.quiz_title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(quiz.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    <span
                      className={`text-sm font-bold ${
                        quiz.passed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {quiz.score}%
                    </span>
                    {quiz.passed && <Award className="w-4 h-4 text-green-600 ml-2" />}
                  </div>
                </div>
              ))}
              {(!stats?.recentQuizzes || stats.recentQuizzes.length === 0) && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No quiz attempts yet
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
