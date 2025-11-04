import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import WelcomeAnimation from '../components/common/WelcomeAnimation';

const ForgotPassword = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-offWhite dark:bg-secondary-main flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-secondary-light rounded-3xl shadow-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-secondary-main dark:text-white mb-4">
            Check Your Email
          </h2>
          <p className="text-neutral-darkGray dark:text-neutral-gray mb-8">
            We've sent password reset instructions to <strong className="text-primary-main">{email}</strong>
          </p>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-[#003B73] to-[#001F3F] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-main/30 transition-all duration-300"
            >
              Back to Login
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 group-hover:bg-white/15 transition-all duration-300"
              >
                <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop"
                  alt="Learning Journey"
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
                  "Live as if you were to die tomorrow. Learn as if you were to live forever."
                </h2>
                <p className="text-xl opacity-90">- Mahatma Gandhi</p>
              </motion.div>
            </Link>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {/* Back Button */}
            <Link
              to="/login"
              className="inline-flex items-center text-neutral-darkGray dark:text-neutral-gray hover:text-primary-main dark:hover:text-primary-light transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Login</span>
            </Link>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-secondary-main dark:text-white mb-2">
                Reset Password
              </h1>
              <p className="text-neutral-darkGray dark:text-neutral-gray">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-secondary-main dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 bg-neutral-offWhite dark:bg-secondary-dark border border-neutral-gray/20 dark:border-secondary-main rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-all text-secondary-main dark:text-white"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#003B73] to-[#001F3F] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-main/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </motion.button>
            </form>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-sm text-neutral-darkGray dark:text-neutral-gray"
            >
              Remember your password?{' '}
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

export default ForgotPassword;
