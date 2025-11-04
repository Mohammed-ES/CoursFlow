import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', path: '/#' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Community', path: '/#community' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-secondary-main/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-neutral-lightGray/50 dark:border-secondary-light/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Click to refresh */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <motion.img 
              src="/image/CoursFlow_logo.png" 
              alt="CoursFlow Logo" 
              className="h-12 w-auto cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-2xl font-bold text-primary-main dark:text-white group-hover:text-accent-cyan transition-colors">
                CoursFlow
              </span>
              <span className="text-xs text-neutral-gray dark:text-neutral-lightGray -mt-1">
                Smart Learning Platform
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="text-secondary-main dark:text-white hover:text-primary-main transition-all duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-main group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="small">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-neutral-lightGray dark:hover:bg-secondary-light transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary-main rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="small">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="small">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-lightGray dark:hover:bg-secondary-light"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-neutral-lightGray dark:border-secondary-light">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-secondary-main dark:text-white hover:text-primary-main transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-secondary-main dark:text-white hover:text-primary-main transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left text-secondary-main dark:text-white hover:text-primary-main transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
