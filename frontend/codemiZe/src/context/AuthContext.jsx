import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const auth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (auth === 'true') {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // For this example, we're using hardcoded credentials
      if (email === 'test@coding.lk' && password === 'test@123') {
        const userData = {
          id: 1,
          email: email,
          name: 'Test User',
          token: 'mock-jwt-token-' + Date.now(),
          role: 'student'
        };
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        resolve(userData);
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to clear user data
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Hook to verify authentication status
  const verifyAuth = () => {
    const auth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (auth === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return { isValid: true, user: userData };
      } catch (error) {
        return { isValid: false, user: null };
      }
    }
    return { isValid: false, user: null };
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
