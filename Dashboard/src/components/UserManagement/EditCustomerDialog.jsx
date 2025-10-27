import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import { Close, Edit, Save } from '@mui/icons-material';

const EditCustomerDialog = ({ open, onClose, customer, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    role: 'customer',
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        gender: customer.gender || '',
        address: customer.address || customer.location || '',
        role: customer.role || 'customer',
        status: customer.status || 'active',
      });
    }
  }, [customer]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(customer.id, formData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'blocked':
        return 'error';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'blocked':
        return 'Bị khóa';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: 1 }} />
            <Typography variant="h6">Chỉnh sửa thông tin khách hàng</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Customer Info Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Avatar
              sx={{ width: 60, height: 60, mr: 2 }}
              src={customer.avatar_url}
            >
              {(customer.full_name || customer.name || customer.email).charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {customer.full_name || customer.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {customer.id}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={getStatusText(customer.status)}
                  color={getStatusColor(customer.status)}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ và tên *"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                error={!!errors.full_name}
                helperText={errors.full_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={formData.gender}
                  label="Giới tính"
                  onChange={handleChange('gender')}
                >
                  <MenuItem value="">Không xác định</MenuItem>
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.address}
                onChange={handleChange('address')}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={handleChange('role')}
                >
                  <MenuItem value="customer">Khách hàng</MenuItem>
                  <MenuItem value="host">Host</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  label="Trạng thái"
                  onChange={handleChange('status')}
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                  <MenuItem value="blocked">Bị khóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Statistics Display */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thống kê hoạt động
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.contrastText">
                    {customer.total_bookings || 0}
                  </Typography>
                  <Typography variant="body2" color="primary.contrastText">
                    Tổng đặt phòng
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.contrastText">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      notation: 'compact',
                    }).format(customer.total_spent || 0)}
                  </Typography>
                  <Typography variant="body2" color="success.contrastText">
                    Tổng chi tiêu
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="h6" color="info.contrastText">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="info.contrastText">
                    Ngày tham gia
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {formData.status === 'blocked' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Tài khoản này đang bị khóa. Khách hàng sẽ không thể đăng nhập hoặc đặt phòng.
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerDialog;