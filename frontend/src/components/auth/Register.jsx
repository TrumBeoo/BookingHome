import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Link,
  Typography,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Auth';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate } = useForm(
    {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: ''
    },
    {
      email: validationRules.email,
      password: validationRules.password,
      confirmPassword: validationRules.confirmPassword,
      name: validationRules.name,
      phone: validationRules.phone
    }
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const getPasswordStrength = () => {
    const password = values.password;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return 'error';
    if (strength < 75) return 'warning';
    return 'success';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản mới" bgType="register" bgImage={'./images/auth/register.jpg'}>

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
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {success}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Họ và tên"
              name="name"
              autoComplete="name"
              autoFocus
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ email"
              name="email"
              autoComplete="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
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
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Số điện thoại"
              name="phone"
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={touched.password && !!errors.password}
              helperText={touched.password ? errors.password : "Ít nhất 8 ký tự, bao gồm chữ và số"}
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
            {values.password && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Độ mạnh mật khẩu:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getPasswordStrength()}
                  color={getPasswordStrengthColor()}
                  sx={{ mt: 0.5, borderRadius: 1 }}
                />
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? null : <PersonAdd />}
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
            'Tạo tài khoản'
          )}
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Chip label="hoặc" size="small" />
        </Divider>
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Đã có tài khoản?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ 
                textDecoration: 'none',
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Register;