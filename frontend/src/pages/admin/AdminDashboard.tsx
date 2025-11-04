import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  BookOpen,
  Clock,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import { adminService, DashboardStats, RecentActivity } from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';
import RevenueChart from '../../components/charts/RevenueChart';
import EnrollmentChart from '../../components/charts/EnrollmentChart';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivities(),
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = stats ? [
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      change: `+${stats.studentsGrowth}%`,
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toString(),
      change: `+${stats.teachersGrowth}%`,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: `+${stats.revenueGrowth}%`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses.toString(),
      change: `+${stats.coursesGrowth}%`,
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ] : [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return '📚';
      case 'payment':
        return '💰';
      case 'completion':
        return '🎓';
      default:
        return '📌';
    }
  };

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-main dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-neutral-darkGray dark:text-neutral-gray">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16`}></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-neutral-darkGray dark:text-neutral-gray text-sm mb-1">
                          {stat.title}
                        </p>
                        <h3 className="text-3xl font-bold text-secondary-main dark:text-white">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-sm font-semibold">
                        {stat.change}
                      </span>
                      <span className="text-neutral-gray text-sm">vs last month</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-6">
                Aperçu des Revenus
              </h3>
              <RevenueChart />
            </Card>
          </motion.div>

          {/* Student Enrollment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <h3 className="text-xl font-bold text-secondary-main dark:text-white mb-6">
                Inscriptions Hebdomadaires
              </h3>
              <EnrollmentChart />
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-secondary-main dark:text-white">
                  Recent Activities
                </h3>
                <Clock className="w-5 h-5 text-neutral-gray" />
              </div>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-neutral-offWhite dark:hover:bg-secondary-dark transition-colors border border-neutral-lightGray dark:border-secondary-main"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-main to-accent-cyan rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-secondary-main dark:text-white font-semibold">
                        {activity.student_name}
                      </p>
                      <p className="text-sm text-neutral-gray truncate">
                        {activity.details} - {activity.course_name}
                      </p>
                      <p className="text-xs text-neutral-gray mt-1">
                        {formatActivityTime(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
