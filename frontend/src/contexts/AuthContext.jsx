import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, isTokenExpired } from '../utils/tokenUtils';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      if (token) {
        if (isTokenExpired(token)) {
          removeToken();
          setIsAuthenticated(false);
          setUser(null);
        } else {
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Auth check failed:', error);
            removeToken();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.access_token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Handle redirect after successful login
        const redirectPath = sessionStorage.getItem('redirectPath');
        if (redirectPath) {
          sessionStorage.removeItem('redirectPath');
          window.location.href = redirectPath;
        }
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('redirectPath');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};