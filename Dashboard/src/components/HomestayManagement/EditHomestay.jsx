import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Save,
  Cancel,
  LocationOn,
  AttachMoney,
  People,
  Bed,
  Bathtub,
} from '@mui/icons-material';
import ApiService from '../../services/api';

const EditHomestay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    price_per_night: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    status: 'active',
    featured: false,
  });

  const availableAmenities = [
    'WiFi',
    'Điều hòa',
    'Bếp',
    'Hồ bơi',
    'Bãi đậu xe',
    'Máy giặt',
    'TV',
    'Ban công',
    'Vườn',
    'BBQ',
    'Gym',
    'Spa',
  ];

  useEffect(() => {
    loadHomestayData();
  }, [id]);

  const loadHomestayData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ApiService.getHomestay(id);
      
      if (!response) {
        throw new Error('Không nhận được dữ liệu từ server');
      }
      
      const homestay = response.data || response.homestay || response;
      
      if (!homestay) {
        throw new Error('Không tìm thấy thông tin homestay');
      }
      
      setFormData({
        name: homestay.name || '',
        description: homestay.description || '',
        address: homestay.address || homestay.location || '',
        price_per_night: homestay.price_per_night || homestay.price || '',
        max_guests: homestay.max_guests || homestay.capacity || '',
        bedrooms: homestay.bedrooms || '',
        bathrooms: homestay.bathrooms || '',
        amenities: Array.isArray(homestay.amenities) ? homestay.amenities : [],
        status: homestay.status || 'active',
        featured: homestay.featured || false,
      });
    } catch (error) {
      console.error('Failed to load homestay:', error);
      setError(error.message || 'Không thể tải thông tin homestay. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenitiesChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      amenities: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.name || !formData.address || !formData.price_per_night) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const updateData = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        max_guests: parseInt(formData.max_guests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      };

      await ApiService.updateHomestay(id, updateData);
      setSuccess('Cập nhật homestay thành công!');
      
      setTimeout(() => {
        navigate('/dashboard/homestays');
      }, 2000);
    } catch (error) {
      console.error('Failed to update homestay:', error);
      setError('Có lỗi xảy ra khi cập nhật homestay: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/homestays');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Chỉnh sửa Homestay
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên homestay"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  label="Trạng thái"
                  onChange={handleInputChange('status')}
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="pending">Chờ duyệt</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.address}
                onChange={handleInputChange('address')}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            {/* Thông tin chi tiết */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Thông tin chi tiết
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Giá/đêm (VNĐ)"
                type="number"
                value={formData.price_per_night}
                onChange={handleInputChange('price_per_night')}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Số khách tối đa"
                type="number"
                value={formData.max_guests}
                onChange={handleInputChange('max_guests')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Số phòng ngủ"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange('bedrooms')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Bed />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Số phòng tắm"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange('bathrooms')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Bathtub />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Tiện ích */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Tiện ích
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tiện ích</InputLabel>
                <Select
                  multiple
                  value={formData.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Tiện ích" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableAmenities.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      <Checkbox checked={formData.amenities.indexOf(amenity) > -1} />
                      <ListItemText primary={amenity} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditHomestay;