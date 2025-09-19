import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Wifi,
  LocalParking,
  Restaurant,
  Pool,
  Pets,
  AcUnit,
  Person,
  Phone,
  Email,
  Share,
  Favorite,
  FavoriteBorder,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { useAuth } from '../../contexts/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data
  const mockProperty = {
    id: 1,
    name: 'Villa Sapa Tuyệt Đẹp',
    location: 'Sa Pa, Lào Cai',
    fullAddress: '123 Đường Hoàng Liên, TT. Sa Pa, Lào Cai',
    price: 1200000,
    rating: 4.8,
    reviewCount: 124,
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
    ],
    amenities: [
      { id: 'wifi', label: 'WiFi miễn phí', icon: <Wifi /> },
      { id: 'parking', label: 'Bãi đậu xe', icon: <LocalParking /> },
      { id: 'restaurant', label: 'Nhà hàng', icon: <Restaurant /> },
      { id: 'pool', label: 'Hồ bơi', icon: <Pool /> },
    ],
    description: `Villa hiện đại với kiến trúc độc đáo, nằm trên đồi cao có tầm nhìn bao quát toàn cảnh thị trấn Sa Pa và dãy núi Hoàng Liên Sơn hùng vĩ. 

    Không gian thoáng đãng, được thiết kế theo phong cách hiện đại kết hợp với nét truyền thống của vùng núi phía Bắc. Villa có 4 phòng ngủ rộng rãi, mỗi phòng đều có ban công riêng và view núi tuyệt đẹp.

    Đặc biệt, villa có khu vườn rộng với nhiều loại hoa và cây trái địa phương, tạo không gian thư giãn lý tưởng cho du khách.`,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    host: {
      name: 'Chị Lan Hương',
      avatar: 'L',
      phone: '0987654321',
      email: 'lan.huong@example.com',
      rating: 4.9,
      reviews: 89,
      joinedDate: 'Tham gia từ 2020',
      description: 'Tôi là người bản địa Sa Pa, rất hiểu về văn hóa và các địa điểm du lịch đẹp ở đây. Luôn sẵn sàng tư vấn cho khách về hành trình khám phá Sa Pa.',
    },
    houseRules: [
      'Check-in: 14:00 - 22:00',
      'Check-out: 12:00',
      'Không hút thuốc trong nhà',
      'Không tổ chức tiệc tùng',
      'Giữ gìn vệ sinh chung',
    ],
    nearbyPlaces: [
      { name: 'Chợ Sa Pa', distance: '1.2 km' },
      { name: 'Núi Hàm Rồng', distance: '2.5 km' },
      { name: 'Thác Bạc', distance: '12 km' },
      { name: 'Fansipan', distance: '15 km' },
    ],
    reviews: [
      {
        id: 1,
        user: 'Nguyễn Văn Nam',
        rating: 5,
        date: '2024-01-15',
        comment: 'Villa rất đẹp, view tuyệt vời! Chị chủ nhà rất thân thiện và nhiệt tình. Sẽ quay lại lần sau.',
        avatar: 'N',
      },
      {
        id: 2,
        user: 'Trần Thị Lan',
        rating: 4,
        date: '2024-01-10',
        comment: 'Không gian thoáng mát, sạch sẽ. Phù hợp cho gia đình có trẻ nhỏ.',
        avatar: 'L',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    navigate(`/property/${id}/booking`);
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setImageDialogOpen(true);
  };

  const LoginDialog = () => (
    <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
      <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn cần đăng nhập để thêm vào yêu thích hoặc đặt phòng.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setLoginDialogOpen(false)}>Hủy</Button>
        <Button
          variant="contained"
          onClick={() => {
            setLoginDialogOpen(false);
            navigate('/login');
          }}
        >
          Đăng nhập
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ImageDialog = () => (
    <Dialog 
      open={imageDialogOpen} 
      onClose={() => setImageDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ position: 'relative', bgcolor: 'black' }}>
        <IconButton
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
          onClick={() => setImageDialogOpen(false)}
        >
          ×
        </IconButton>
        
        <Box
          sx={{
            height: 400,
            backgroundImage: `url(${property?.images[currentImageIndex]})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
          }}
        >
          <IconButton
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setCurrentImageIndex(
              currentImageIndex === 0 ? property.images.length - 1 : currentImageIndex - 1
            )}
          >
            <ChevronLeft />
          </IconButton>
          
          <IconButton
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setCurrentImageIndex(
              currentImageIndex === property.images.length - 1 ? 0 : currentImageIndex + 1
            )}
          >
            <ChevronRight />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 2, textAlign: 'center', color: 'white' }}>
          <Typography variant="body2">
            {currentImageIndex + 1} / {property?.images.length}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography>Đang tải...</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {property.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ color: 'gold', fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {property.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({property.reviewCount} đánh giá)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">•</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {property.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => navigator.share?.({ url: window.location.href })}>
                <Share />
              </IconButton>
              <IconButton onClick={handleFavoriteClick}>
                {isFavorite ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Images */}
        <Box sx={{ mb: 4 }}>
          <ImageList cols={4} rowHeight={200} gap={8}>
            {property.images.slice(0, 4).map((image, index) => (
              <ImageListItem 
                key={index}
                cols={index === 0 ? 2 : 1}
                rows={index === 0 ? 2 : 1}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  }
                }}
                onClick={() => handleImageClick(index)}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Ảnh {index + 1}
                  </Typography>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Property Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Thông tin cơ bản
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <Typography variant="body1">
                    👥 {property.maxGuests} khách
                  </Typography>
                  <Typography variant="body1">
                    🛏️ {property.bedrooms} phòng ngủ
                  </Typography>
                  <Typography variant="body1">
                    🚿 {property.bathrooms} phòng tắm
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Mô tả
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {property.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Tiện nghi
                </Typography>
                <Grid container spacing={2}>
                  {property.amenities.map((amenity) => (
                    <Grid item xs={6} md={4} key={amenity.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {amenity.icon}
                        </Box>
                        <Typography variant="body1">
                          {amenity.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Host Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Thông tin chủ nhà
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'primary.main',
                      fontSize: '1.5rem',
                    }}
                  >
                    {property.host.avatar}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {property.host.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {property.host.rating} ({property.host.reviews} đánh giá)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {property.host.joinedDate}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {property.host.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Phone />}
                        size="small"
                        href={`tel:${property.host.phone}`}
                      >
                        Gọi điện
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Email />}
                        size="small"
                        href={`mailto:${property.host.email}`}
                      >
                        Nhắn tin
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Đánh giá từ khách hàng
                </Typography>
                {property.reviews.map((review) => (
                  <Box key={review.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {review.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={review.rating} size="small" readOnly sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.date).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {property.price.toLocaleString()}đ
                    <Typography component="span" variant="body1" color="text.secondary">
                      /đêm
                    </Typography>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: 'gold', fontSize: 20, mr: 0.5 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {property.rating}
                    </Typography>
                  </Box>
                </Box>

                {!isAuthenticated && (
                  <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 3 }}>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                      Đăng nhập để xem giá tốt nhất và đặt phòng
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleBookNow}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {isAuthenticated ? 'Đặt phòng ngay' : 'Đăng nhập để đặt phòng'}
                </Button>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                  Bạn chưa bị tính phí
                </Typography>

                {/* Quick Info */}
                <Box sx={{ '& > *': { mb: 1 } }}>
                  <Typography variant="body2">
                    📍 {property.fullAddress}
                  </Typography>
                  <Typography variant="body2">
                    ✅ Xác nhận ngay lập tức
                  </Typography>
                  <Typography variant="body2">
                    🚫 Hủy miễn phí trong 24h
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <LoginDialog />
      <ImageDialog />
    </Layout>
  );
};

export default PropertyDetail;