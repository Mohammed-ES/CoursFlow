import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, FileQuestion } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-offWhite dark:bg-secondary-main flex flex-col">
      {/* Simple Header */}
      <header className="bg-white dark:bg-secondary-light border-b border-neutral-lightGray dark:border-secondary-main py-4">
        <div className="container-custom flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <motion.img
              src="/image/CoursFlow_logo.png"
              alt="CoursFlow"
              className="h-10 w-auto cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
            <span className="text-2xl font-bold text-secondary-main dark:text-white">
              CoursFlow
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/courses"
              className="text-neutral-darkGray dark:text-neutral-gray hover:text-primary-main transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              to="/contact"
              className="text-neutral-darkGray dark:text-neutral-gray hover:text-primary-main transition-colors"
            >
              Contact Us
            </Link>
            <Link to="/login">
              <Button variant="outline" className="mr-2">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-64 h-64 bg-gradient-to-br from-neutral-lightGray/30 to-neutral-offWhite dark:from-secondary-light/30 dark:to-secondary-dark/30 rounded-full mb-8">
              <div className="relative">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FileQuestion className="w-32 h-32 text-primary-main" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-primary-main/20 rounded-full blur-sm"
                />
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-main dark:text-white mb-4">
              Oops! Page Not Found.
            </h1>
            <p className="text-lg text-neutral-darkGray dark:text-neutral-gray mb-8 max-w-xl mx-auto">
              The page you're looking for doesn't exist. Please check the URL for typos or try searching for what you need.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSearch}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
              <input
                type="text"
                placeholder="Search for courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-secondary-light border border-neutral-lightGray dark:border-secondary-main focus:outline-none focus:ring-2 focus:ring-primary-main text-secondary-main dark:text-white"
              />
            </div>
          </motion.form>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/">
              <Button variant="primary" className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Go to Homepage</span>
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Visit Sitemap</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary-light border-t border-neutral-lightGray dark:border-secondary-main py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
              <Link to="/about" className="hover:text-primary-main transition-colors">
                About Us
              </Link>
              <Link to="/privacy" className="hover:text-primary-main transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-main transition-colors">
                Terms of Service
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg flex items-center justify-center hover:bg-primary-main hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg flex items-center justify-center hover:bg-primary-main hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-offWhite dark:bg-secondary-dark rounded-lg flex items-center justify-center hover:bg-primary-main hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-neutral-darkGray dark:text-neutral-gray">
            © 2025 CoursFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
