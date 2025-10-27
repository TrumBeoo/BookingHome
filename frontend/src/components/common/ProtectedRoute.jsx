import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading while auth is initializing
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" color="white">
          Đang tải...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Store the attempted location for redirect after login
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ p: 3 }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Không có quyền truy cập
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bạn không có quyền truy cập vào trang này.
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;