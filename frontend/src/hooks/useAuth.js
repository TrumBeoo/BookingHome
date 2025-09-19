import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { AUTH_ERRORS } from '../constants/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          authService.logout();
          setError(AUTH_ERRORS.TOKEN_EXPIRED);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      const userData = await authService.getCurrentUser();
      
      setUser(userData);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || AUTH_ERRORS.LOGIN_FAILED;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || AUTH_ERRORS.REGISTRATION_FAILED;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError
  };
};