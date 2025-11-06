import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  History,
  Favorite,
  Settings,
  Cancel,
  CheckCircle,
  Pending,
  LocationOn,
  Star,
  Visibility,
} from '@mui/icons-material';
import Layout from '../common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Fetch booking history
  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!user) return;
      
      try {
        setLoadingBookings(true);
        setBookingError(null);
        const response = await api.getUserBookings();
        setBookingHistory(response.bookings || []);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setBookingError('Không thể tải lịch sử đặt phòng');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookingHistory();
  }, [user]);

  const [favorites] = useState([
    {
      id: 1,
      name: 'Villa Sapa Tuyệt Đẹp',
      location: 'Sa Pa, Lào Cai',
      price: 1200000,
      rating: 4.8,
      image: '/api/placeholder/300/200',
    },
    {
      id: 2,
      name: 'Homestay Hội An Cổ Kính',
      location: 'Hội An, Quảng Nam',
      price: 800000,
      rating: 4.9,
      image: '/api/placeholder/300/200',
    },
  ]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    updateUser(profileData);
    setEditMode(false);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = () => {
    console.log('Cancel booking:', selectedBooking.id);
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'confirmed':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã hoàn thành';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const renderProfileTab = () => (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Thông tin cá nhân
          </Typography>
          <Button
            variant={editMode ? 'contained' : 'outlined'}
            startIcon={editMode ? <CheckCircle /> : <Edit />}
            onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
          >
            {editMode ? 'Lưu thay đổi' : 'Chỉnh sửa'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
              {editMode && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    mt: -2,
                    ml: -2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Giới thiệu bản thân"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!editMode}
                  placeholder="Chia sẻ một chút về bản thân bạn..."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderBookingHistoryTab = () => (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Lịch sử đặt phòng
          </Typography>
        </Box>
        
        {loadingBookings ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : bookingError ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{bookingError}</Alert>
          </Box>
        ) : bookingHistory.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Bạn chưa có lịch sử đặt phòng nào.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Homestay</TableCell>
                  <TableCell>Ngày lưu trú</TableCell>
                  <TableCell>Khách</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingHistory.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 40,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
                            IMG
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {booking.homestay_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mã đặt phòng: {booking.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(booking.check_in).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(booking.check_out).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell>{booking.guests} khách</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {Number(booking.total_price).toLocaleString()}đ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(booking.status)}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" title="Xem chi tiết">
                          <Visibility />
                        </IconButton>
                        {booking.status === 'pending' && (
                          <IconButton
                            size="small"
                            color="error"
                            title="Hủy đặt phòng"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            <Cancel />
                          </IconButton>
                        )}
                        {booking.status === 'completed' && !booking.rating && (
                          <Button size="small" variant="outlined">
                            Đánh giá
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderFavoritesTab = () => (
    <Grid container spacing={3}>
      {favorites.map((property) => (
        <Grid item xs={12} sm={6} md={4} key={property.id}>
          <Card>
            <Box
              sx={{
                height: 200,
                bgcolor: 'grey.200',
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                Property Image
              </Typography>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: 'red',
                }}
              >
                <Favorite />
              </IconButton>
            </Box>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {property.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {property.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{property.rating}</Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  {property.price.toLocaleString()}đ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderProfileTab();
      case 1:
        return renderBookingHistoryTab();
      case 2:
        return renderFavoritesTab();
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Tài khoản của tôi
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Thông tin cá nhân" icon={<Settings />} iconPosition="start" />
            <Tab label="Lịch sử đặt phòng" icon={<History />} iconPosition="start" />
            <Tab label="Yêu thích" icon={<Favorite />} iconPosition="start" />
          </Tabs>
        </Box>

        {renderTabContent()}
      </Container>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Xác nhận hủy đặt phòng</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy đặt phòng này không?
          </Alert>
          {selectedBooking && (
            <Box>
              <Typography variant="h6">{selectedBooking.property}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedBooking.location}
              </Typography>
              <Typography variant="body2">
                Ngày: {new Date(selectedBooking.checkin).toLocaleDateString('vi-VN')} - {new Date(selectedBooking.checkout).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant="body2">
                Tổng tiền: {selectedBooking.total.toLocaleString()}đ
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Không</Button>
          <Button variant="contained" color="error" onClick={confirmCancelBooking}>
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserProfile;