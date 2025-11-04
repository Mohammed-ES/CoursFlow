import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WelcomeAnimation from '../components/common/WelcomeAnimation';

const Register = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-offWhite dark:bg-secondary-main flex items-center justify-center p-4">
      {/* Welcome Animation */}
      {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white dark:bg-secondary-light rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Side - Illustration */}
          <div className="relative bg-gradient-to-br from-[#003B73] to-[#001F3F] p-12 flex-col justify-between text-white overflow-hidden hidden md:flex">
            {/* Decorative Elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-10 left-10 w-64 h-64 bg-primary-main/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-10 right-10 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl"
            />

            {/* Illustration */}
            <Link to="/" className="relative z-10 block cursor-pointer group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 flex items-center justify-center"
              >
                <img
                  src="/image/CoursFlow_logo.png"
                  alt="CoursFlow"
                  className="h-20 w-auto drop-shadow-lg"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 group-hover:bg-white/15 transition-all duration-300"
              >
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                  alt="Students Learning Together"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </motion.div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  "Education is the most powerful weapon which you can use to change the world."
                </h2>
                <p className="text-xl opacity-90">- Nelson Mandela</p>
              </motion.div>
            </Link>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {/* Logo for mobile */}
            <div className="flex justify-center mb-6 md:hidden">
              <img
                src="/image/CoursFlow_logo.png"
                alt="CoursFlow"
                className="h-16 w-auto"
              />
            </div>
            
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-neutral-offWhite dark:bg-secondary-dark rounded-xl p-1">
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-lg text-neutral-darkGray dark:text-neutral-gray hover:text-secondary-main dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <div className="px-6 py-2.5 bg-gradient-to-r from-[#003B73] to-[#001F3F] rounded-lg text-white font-semibold">
                  Register
                </div>
              </div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-secondary-main dark:text-white mb-2">
                Create an Account
              </h1>
              <p className="text-neutral-darkGray dark:text-neutral-gray">
                Join SmartCourses+ to start your learning journey.
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all text-secondary-main dark:text-white"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all text-secondary-main dark:text-white"
                />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all text-secondary-main dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-main transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Role */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                  I am a
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all text-secondary-main dark:text-white appearance-none cursor-pointer"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#003B73] to-[#001F3F] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-main/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-gray/20 dark:border-secondary-main"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-secondary-light text-neutral-darkGray dark:text-neutral-gray">
                  Or continue with
                </span>
              </div>
            </motion.div>

            {/* Google Sign Up */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                // Redirect to Google OAuth
                window.location.href = 'http://localhost:8000/api/auth/google';
              }}
              className="w-full py-3.5 bg-white dark:bg-secondary-dark border-2 border-neutral-gray/20 dark:border-secondary-main text-secondary-main dark:text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </motion.button>

            {/* Login Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6 text-center text-neutral-darkGray dark:text-neutral-gray"
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-main hover:text-accent-cyan font-semibold transition-colors"
              >
                Sign in
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
