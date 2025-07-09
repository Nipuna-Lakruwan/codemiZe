import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // For this example, we're using hardcoded credentials
      if (email === 'test@coding.lk' && password === 'test@123') {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        resolve(true);
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
