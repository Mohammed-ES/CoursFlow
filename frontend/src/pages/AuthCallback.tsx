import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const role = searchParams.get('role');
        const userData = searchParams.get('user');
        const dashboard = searchParams.get('dashboard');
        const error = searchParams.get('error');

        // Check for error
        if (error) {
          setStatus('error');
          setMessage(decodeURIComponent(error));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Validate required parameters
        if (!token || !role || !userData || !dashboard) {
          setStatus('error');
          setMessage('Invalid authentication response. Missing required data.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Parse user data
        const user = JSON.parse(userData);

        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('user', JSON.stringify(user));

        if (role === 'admin') {
          localStorage.setItem('adminToken', token);
        }

        // Refresh auth context
        await refreshAuth();

        // Success
        setStatus('success');
        setMessage(`Welcome ${user.name}! Redirecting to your dashboard...`);

        // Redirect to dashboard
        setTimeout(() => {
          navigate(dashboard);
        }, 1500);

      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('Failed to process authentication. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003B73] to-[#001F3F] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-secondary-light rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        {/* Loading State */}
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-6"
            >
              <Loader2 className="w-16 h-16 text-primary-main" />
            </motion.div>
            <h2 className="text-2xl font-bold text-secondary-main dark:text-white mb-3">
              Authenticating...
            </h2>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              {message}
            </p>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-secondary-main dark:text-white mb-3">
              Success!
            </h2>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              {message}
            </p>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6"
            >
              <XCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-secondary-main dark:text-white mb-3">
              Authentication Failed
            </h2>
            <p className="text-neutral-darkGray dark:text-neutral-gray">
              {message}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
