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
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Divider,
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Timer as TimerIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { vi } from 'date-fns/locale';

const PromotionForm = ({ open, onClose, onSave, type, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    is_active: true,
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    // Banner specific
    image: '',
    position: 'hero',
    // Popup specific
    trigger_delay: 3000,
    show_frequency: 'once_per_session'
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        start_date: new Date(initialData.start_date),
        end_date: new Date(initialData.end_date)
      });
      setImagePreview(initialData.image || '');
    } else {
      setFormData({
        title: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        is_active: true,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        image: '',
        position: 'hero',
        trigger_delay: 3000,
        show_frequency: 'once_per_session'
      });
      setImagePreview('');
    }
  }, [initialData, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field) => (date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      start_date: formData.start_date.toISOString().split('T')[0],
      end_date: formData.end_date.toISOString().split('T')[0]
    };
    onSave(dataToSave);
  };

  const isFormValid = () => {
    return formData.title && formData.description && formData.discount_value > 0;
  };

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {initialData ? 'Chỉnh Sửa' : 'Tạo Mới'} {type === 'banner' ? 'Banner' : 'Popup'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type === 'banner' ? 'Tạo banner quảng cáo để hiển thị trên website' : 'Tạo popup khuyến mãi để thu hút khách hàng'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Thông Tin Cơ Bản
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={formData.title}
                onChange={handleChange('title')}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange('is_active')}
                  />
                }
                label="Kích hoạt ngay"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
                required
              />
            </Grid>

            {/* Discount Settings */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Cài Đặt Giảm Giá
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá</InputLabel>
                <Select
                  value={formData.discount_type}
                  onChange={handleChange('discount_type')}
                  label="Loại giảm giá"
                >
                  <MenuItem value="percentage">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PercentIcon sx={{ mr: 1 }} />
                      Phần trăm (%)
                    </Box>
                  </MenuItem>
                  <MenuItem value="fixed">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MoneyIcon sx={{ mr: 1 }} />
                      Số tiền cố định (đ)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá trị giảm"
                type="number"
                value={formData.discount_value}
                onChange={handleChange('discount_value')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {formData.discount_type === 'percentage' ? '%' : 'đ'}
                    </InputAdornment>
                  )
                }}
                required
              />
            </Grid>

            {/* Date Range */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Thời Gian Áp Dụng
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                value={formData.start_date.toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  start_date: new Date(e.target.value)
                }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                value={formData.end_date.toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  end_date: new Date(e.target.value)
                }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Banner Specific Settings */}
            {type === 'banner' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Cài Đặt Banner
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Vị trí hiển thị</InputLabel>
                    <Select
                      value={formData.position}
                      onChange={handleChange('position')}
                      label="Vị trí hiển thị"
                    >
                      <MenuItem value="hero">Trang chủ - Hero Section</MenuItem>
                      <MenuItem value="sidebar">Thanh bên</MenuItem>
                      <MenuItem value="footer">Cuối trang</MenuItem>
                      <MenuItem value="popup">Popup overlay</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<UploadIcon />}
                    sx={{ height: 56 }}
                  >
                    Tải lên hình ảnh
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Grid>

                {imagePreview && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Xem trước hình ảnh:
                        </Typography>
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Preview"
                          sx={{
                            width: '100%',
                            maxHeight: 200,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </>
            )}

            {/* Popup Specific Settings */}
            {type === 'popup' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Cài Đặt Popup
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Thời gian hiển thị (giây)"
                    type="number"
                    value={formData.trigger_delay / 1000}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      trigger_delay: parseInt(e.target.value) * 1000
                    }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimerIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tần suất hiển thị</InputLabel>
                    <Select
                      value={formData.show_frequency}
                      onChange={handleChange('show_frequency')}
                      label="Tần suất hiển thị"
                    >
                      <MenuItem value="once_per_session">Một lần mỗi phiên</MenuItem>
                      <MenuItem value="once_per_day">Một lần mỗi ngày</MenuItem>
                      <MenuItem value="always">Luôn hiển thị</MenuItem>
                      <MenuItem value="never">Không hiển thị</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!isFormValid()}
            sx={{ minWidth: 120 }}
          >
            {initialData ? 'Cập Nhật' : 'Tạo Mới'}
          </Button>
        </DialogActions>
      </Dialog>
    // </LocalizationProvider>
  );
};

export default PromotionForm;