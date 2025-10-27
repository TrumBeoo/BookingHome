import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, isTokenExpired } from '../utils/tokenUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      if (token) {
        // Kiểm tra token có hết hạn không
        if (isTokenExpired(token)) {
          removeToken();
          setIsAuthenticated(false);
        } else {
          // Tin tưởng token nếu chưa hết hạn
          setIsAuthenticated(true);
          console.log('Token found, user authenticated:', token.substring(0, 20) + '...');
        }
      } else {
        console.log('No token found, user not authenticated');
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token) => {
    if (token) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      console.log('Token saved:', token);
    } else {
      console.error('No token provided to login function');
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};