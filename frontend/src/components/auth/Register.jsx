import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Link,
  Typography,
  CircularProgress,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Auth';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);



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
    <AuthLayout title="Đăng Ký">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin='normal'
              required
              fullWidth
              id="name"
              label="Họ và tên"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin='normal'
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin='normal'
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
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin='normal'
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={touched.password && !!errors.password}
              helperText={touched.password ? errors.password : "Ít nhất 8 ký tự, bao gồm chữ và số"}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin='normal'
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
              disabled={loading}
            />
          </Grid>
        </Grid>
       
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Đăng Ký'}
        </Button>
        
        <Box textAlign="center">
          <Typography variant="body2">
            Đã có tài khoản?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ textDecoration: 'none' }}
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