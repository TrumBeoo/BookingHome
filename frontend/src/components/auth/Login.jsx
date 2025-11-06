import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Link,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Auth';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const response = await login(formData.email, formData.password);
      if (response.redirectPath) {
        window.location.href = response.redirectPath;
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Chào mừng trở lại" bgType="login" bgImage={'./images/auth/login.jpg'}>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Địa chỉ email"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? null : <LoginIcon />}
          disabled={loading}
          sx={{ 
            mt: 3, 
            mb: 3, 
            py: 1.5,
            borderRadius: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Đăng nhập'
          )}
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Chip label="hoặc" size="small" />
        </Divider>
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Chưa có tài khoản?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{ 
                textDecoration: 'none',
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Login;