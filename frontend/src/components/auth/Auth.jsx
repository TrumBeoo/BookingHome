import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Auth = ({ children, title, bgType = 'login', bgImage }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default background images - bạn có thể thay đổi URLs này
  const defaultBgImages = {
    login: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    register: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  };

  const backgroundImage = bgImage || defaultBgImages[bgType];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      {/* Background Image Side - Ẩn trên mobile */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)', // Overlay để text dễ đọc
              zIndex: 1
            }
          }}
        >
          {/* Logo và brand trên background */}
          <Box
            sx={{
              position: 'absolute',
              top: 40,
              left: 40,
              zIndex: 2,
              color: 'white',
              
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
             
            </Box>
            <Typography variant="h1" sx={{ opacity: 0.9, maxWidth: 500 }}>
             
            </Typography>
          </Box>
        </Box>
      )}

      {/* Form Side */}
      <Box
        sx={{
          flex: isMobile ? 1 : '0 0 480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, md: 5 },
          backgroundColor: 'white',
          position: 'relative'
        }}
      >
        {/* Back button */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'text.secondary'
          }}
        >
          <ArrowBack />
        </IconButton>

        {/* Mobile logo */}
        {isMobile && (
          <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Home sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600} color="primary.main">
                Booking-Home
              </Typography>
            </Box>
          </Box>
        )}

        {/* Form Content */}
        <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 700,
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: 'text.secondary',
              textAlign: 'center'
            }}
          >
            {bgType === 'login' ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới để bắt đầu'}
          </Typography>

          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
