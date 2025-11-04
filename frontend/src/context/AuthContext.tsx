import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        // For development: Load user from localStorage without API call
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // TODO: When backend is ready, uncomment this to validate token with API:
        // const response = await api.get('/user');
        // setUser(response.data.user);
      }
    } catch (error) {
      // If there's an error parsing user data, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('userRole');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // TODO: When backend is ready, uncomment this:
    // const response = await api.post('/login', { email, password });
    // const { token, user: userData } = response.data;
    
    // For development: This function is currently not used.
    // Login is handled directly in Login.tsx component with test credentials.
    throw new Error('Please use test credentials in Login page. Backend API not yet implemented.');
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    // TODO: When backend is ready, uncomment this:
    // const response = await api.post('/register', { name, email, password, role });
    // const { token, user: userData } = response.data;
    
    // For development: Registration not yet implemented
    throw new Error('Registration will be available when backend API is implemented.');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    setUser(null);
    window.location.href = '/login';
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
