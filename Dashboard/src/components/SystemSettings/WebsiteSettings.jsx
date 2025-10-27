import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Save,
  Upload,
  Delete,
  Edit,
  Language,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  YouTube,
} from '@mui/icons-material';

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    // Basic Info
    siteName: 'HomestayVN',
    siteTagline: 'Nền tảng đặt homestay hàng đầu Việt Nam',
    siteDescription: 'Khám phá và đặt phòng homestay tuyệt vời trên khắp Việt Nam với HomestayVN',
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico',
    
    // Contact Info
    email: 'contact@homestayvn.com',
    phone: '1900-1234',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    workingHours: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
    
    // Social Media
    facebook: 'https://facebook.com/homestayvn',
    instagram: 'https://instagram.com/homestayvn',
    twitter: 'https://twitter.com/homestayvn',
    youtube: 'https://youtube.com/homestayvn',
    
    // SEO Settings
    metaTitle: 'HomestayVN - Đặt homestay trực tuyến',
    metaDescription: 'Đặt homestay trực tuyến tại Việt Nam với giá tốt nhất. Hàng nghìn homestay chất lượng đang chờ bạn khám phá.',
    metaKeywords: 'homestay, đặt phòng, du lịch, Việt Nam',
    
    // General Settings
    defaultLanguage: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    dateFormat: 'DD/MM/YYYY',
    
    // Features
    enableBooking: true,
    enableReviews: true,
    enableChat: true,
    enableNotifications: true,
    enableMultiLanguage: false,
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'Website đang bảo trì, vui lòng quay lại sau.',
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
    // Show success message
  };

  const handleLogoUpload = () => {
    // Handle logo upload
    console.log('Upload logo');
  };

  const handleFaviconUpload = () => {
    // Handle favicon upload
    console.log('Upload favicon');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Cài đặt Website
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Save />}
          onClick={handleSave}
          disabled={!unsavedChanges}
        >
          Lưu thay đổi
        </Button>
      </Box>

      {unsavedChanges && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Bạn có thay đổi chưa được lưu. Nhấn "Lưu thay đổi" để áp dụng.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Thông tin cơ bản" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên website"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Slogan"
                    value={settings.siteTagline}
                    onChange={(e) => handleInputChange('siteTagline', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Mô tả website"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Logo & Branding */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Logo & Thương hiệu" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={settings.logo}
                      sx={{ width: 60, height: 60, mr: 2 }}
                      variant="rounded"
                    />
                    <Box>
                      <Typography variant="subtitle2">Logo website</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Upload />}
                          onClick={handleLogoUpload}
                        >
                          Tải lên
                        </Button>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={settings.favicon}
                      sx={{ width: 32, height: 32, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2">Favicon</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Upload />}
                          onClick={handleFaviconUpload}
                        >
                          Tải lên
                        </Button>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Thông tin liên hệ" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email liên hệ"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Địa chỉ"
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Giờ làm việc"
                    value={settings.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Media */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Mạng xã hội" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    value={settings.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    InputProps={{
                      startAdornment: <Facebook sx={{ mr: 1, color: '#1877f2' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={settings.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    InputProps={{
                      startAdornment: <Instagram sx={{ mr: 1, color: '#e4405f' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    value={settings.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    InputProps={{
                      startAdornment: <Twitter sx={{ mr: 1, color: '#1da1f2' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="YouTube"
                    value={settings.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    InputProps={{
                      startAdornment: <YouTube sx={{ mr: 1, color: '#ff0000' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* SEO Settings */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Cài đặt SEO" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Meta Title"
                    value={settings.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    helperText="Tiêu đề hiển thị trên kết quả tìm kiếm"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Meta Keywords"
                    value={settings.metaKeywords}
                    onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                    helperText="Từ khóa cách nhau bởi dấu phẩy"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Meta Description"
                    value={settings.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    helperText="Mô tả hiển thị trên kết quả tìm kiếm (tối đa 160 ký tự)"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Cài đặt chung" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Ngôn ngữ mặc định"
                    value={settings.defaultLanguage}
                    onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Múi giờ"
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                    <option value="UTC">UTC</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Đơn vị tiền tệ"
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Định dạng ngày"
                    value={settings.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Tính năng" />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableBooking}
                        onChange={(e) => handleInputChange('enableBooking', e.target.checked)}
                      />
                    }
                    label="Cho phép đặt phòng"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableReviews}
                        onChange={(e) => handleInputChange('enableReviews', e.target.checked)}
                      />
                    }
                    label="Cho phép đánh giá"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableChat}
                        onChange={(e) => handleInputChange('enableChat', e.target.checked)}
                      />
                    }
                    label="Chat trực tuyến"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableNotifications}
                        onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                      />
                    }
                    label="Thông báo push"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableMultiLanguage}
                        onChange={(e) => handleInputChange('enableMultiLanguage', e.target.checked)}
                      />
                    }
                    label="Đa ngôn ngữ"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Mode */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Chế độ bảo trì" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                        color="warning"
                      />
                    }
                    label="Bật chế độ bảo trì"
                  />
                  {settings.maintenanceMode && (
                    <Chip
                      label="Website đang ở chế độ bảo trì"
                      color="warning"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Thông báo bảo trì"
                    value={settings.maintenanceMessage}
                    onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                    disabled={!settings.maintenanceMode}
                    helperText="Thông báo hiển thị khi website đang bảo trì"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={!unsavedChanges}
        >
          Lưu tất cả thay đổi
        </Button>
      </Box>
    </Box>
  );
};

export default WebsiteSettings;