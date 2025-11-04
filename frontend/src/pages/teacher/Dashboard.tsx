import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
} from 'lucide-react';
import TeacherLayout from '../../components/layout/TeacherLayout';
import teacherAPI, { DashboardStats } from '../../services/teacherAPI';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

const TeacherDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getDashboard();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </TeacherLayout>
    );
  }

  // Stats Cards Data with modern design
  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      change: '+12%',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Courses',
      value: stats?.publishedCourses || 0,
      change: '+8%',
      icon: BookOpen,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate?.toFixed(1) || 0}%`,
      change: '+5%',
      icon: CheckCircle,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Avg Quiz Score',
      value: `${stats?.averageQuizScore?.toFixed(1) || 0}%`,
      change: '+3%',
      icon: Award,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  // Course Performance Chart Data (Bar Chart)
  const coursePerformanceData = {
    labels: stats?.topCourses?.map(c => c.title.substring(0, 20)) || [],
    datasets: [
      {
        label: 'Students Enrolled',
        data: stats?.topCourses?.map(c => c.enrolled) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Attendance Trend Chart Data (Line Chart)
  const attendanceTrendData = {
    labels: stats?.attendanceTrend?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: stats?.attendanceTrend?.map((d) => {
          const total = d.present + d.absent;
          return total > 0 ? ((d.present / total) * 100).toFixed(1) : 0;
        }) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Course Status Doughnut Chart
  const courseStatusData = {
    labels: ['Published', 'Draft', 'Archived'],
    datasets: [
      {
        data: [
          stats?.publishedCourses || 0,
          stats?.draftCourses || 0,
          stats?.archivedCourses || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 2,
      },
    ],
  };

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
        ticks: {
          precision: 0,
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
          font: {
            size: 12,
            weight: 500,
          },
          padding: 15,
        },
      },
    },
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your teaching activity.
          </p>
        </motion.div>

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
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full`}></div>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Performance Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Top Courses by Enrollment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Student distribution across your courses
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-72">
              <Bar data={coursePerformanceData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Attendance Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Attendance Trend
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Last 7 days attendance rate
                </p>
              </div>
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-72">
              <Line data={attendanceTrendData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Status Doughnut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Course Status
            </h3>
            <div className="h-64">
              <Doughnut data={courseStatusData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Quick Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Courses</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(stats?.publishedCourses || 0) + (stats?.draftCourses || 0) + (stats?.archivedCourses || 0)}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Students</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalStudents || 0}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Attendance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.attendanceRate?.toFixed(1) || 0}%
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Quiz Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.averageQuizScore?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
