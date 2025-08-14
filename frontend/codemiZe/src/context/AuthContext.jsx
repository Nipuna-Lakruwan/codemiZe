import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoginPage = window.location.pathname === '/';
    if (isLoginPage) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    const fetchSession = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        // 401 is expected when user is not logged in - this is normal
        if (err.response?.status === 401) {
          console.log('No active session found - user needs to log in');
        } else {
          console.error('Session fetch failed:', err);
        }
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);


  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      
      if (response.status === 200) {
        const userData = response.data.user || response.data.school;
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  const verifyAuth = () => {
    return {
      isValid: isAuthenticated && user !== null,
      user: user
    };
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      updateUser,
      clearUser,
      verifyAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);