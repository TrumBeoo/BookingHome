import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  Button,
  Pagination,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn,
  Favorite,
  FavoriteBorder,
  Wifi,
  LocalParking,
  Restaurant,
  Pool,
  Pets,
  AcUnit,
} from '@mui/icons-material';
import Layout from '../common/Layout';
import SearchFilters from './SearchFilters';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  // Mock data - replace with real API
  const mockProperties = [
    {
      id: 1,
      name: 'Villa Sapa Tuyệt Đẹp',
      location: 'Sa Pa, Lào Cai',
      price: 1200000,
      rating: 4.8,
      reviews: 124,
      images: ['/api/placeholder/400/300'],
      amenities: ['wifi', 'parking', 'restaurant', 'pool'],
      description: 'Villa hiện đại với view núi tuyệt đẹp, không gian thoáng mát',
      host: 'Chị Lan',
      maxGuests: 8,
    },
    {
      id: 2,
      name: 'Homestay Truyền Thống Hội An',
      location: 'Hội An, Quảng Nam',
      price: 800000,
      rating: 4.9,
      reviews: 89,
      images: ['/api/placeholder/400/300'],
      amenities: ['wifi', 'restaurant', 'pets'],
      description: 'Nhà cổ truyền thống, gần phố cổ Hội An',
      host: 'Anh Minh',
      maxGuests: 6,
    },
    // Add more mock data...
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, [currentPage]);

  const amenityIcons = {
    wifi: <Wifi />,
    parking: <LocalParking />,
    restaurant: <Restaurant />,
    pool: <Pool />,
    pets: <Pets />,
    ac: <AcUnit />,
  };

  const handleFavoriteClick = (propertyId) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const handleBookNow = (propertyId) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    navigate(`/property/${propertyId}/book`);
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const PropertySkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={240} />
      <CardContent>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" height={24} width="60%" />
        <Skeleton variant="text" height={20} width="40%" />
        <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width={60} height={24} />
          ))}
        </Box>
        <Skeleton variant="text" height={28} width="30%" />
      </CardContent>
    </Card>
  );

  const LoginDialog = () => (
    <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
      <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn cần đăng nhập để thêm vào danh sách yêu thích hoặc đặt phòng.
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

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <SearchFilters />
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={9}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Homestay tại Việt Nam
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${properties.length * totalPages} homestay`}
              </Typography>
            </Box>

            {/* Guest user notice */}
            {!isAuthenticated && (
              <Alert 
                severity="info" 
                sx={{ mb: 3 }}
                action={
                  <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                    Đăng nhập
                  </Button>
                }
              >
                Đăng nhập để lưu yêu thích và đặt phòng nhanh chóng!
              </Alert>
            )}

            {/* Property Grid */}
            <Grid container spacing={3}>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <PropertySkeleton />
                  </Grid>
                ))
              ) : (
                properties.map((property) => (
                  <Grid item xs={12} sm={6} lg={4} key={property.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => handleViewDetails(property.id)}
                    >
                      {/* Image */}
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="div"
                          sx={{
                            height: 240,
                            bgcolor: 'grey.200',
                            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                            Property Image
                          </Typography>
                        </CardMedia>

                        {/* Favorite Button */}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,1)',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteClick(property.id);
                          }}
                        >
                          {favorites.has(property.id) ? (
                            <Favorite sx={{ color: 'red' }} />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>

                        {/* Host Badge */}
                        <Chip
                          label={`Host: ${property.host}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            bgcolor: 'rgba(255,255,255,0.9)',
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        {/* Property Name */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {property.name}
                        </Typography>

                        {/* Location */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            color: 'text.secondary',
                          }}
                        >
                          <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">{property.location}</Typography>
                        </Box>

                        {/* Rating */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Rating
                            value={property.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {property.rating} ({property.reviews} đánh giá)
                          </Typography>
                        </Box>

                        {/* Amenities */}
                        <Box sx={{ mb: 2 }}>
                          {property.amenities.slice(0, 4).map((amenity, index) => (
                            <IconButton
                              key={index}
                              size="small"
                              sx={{
                                mr: 0.5,
                                bgcolor: 'primary.light',
                                color: 'white',
                                width: 28,
                                height: 28,
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                },
                              }}
                            >
                              {amenityIcons[amenity] || <Wifi />}
                            </IconButton>
                          ))}
                        </Box>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {property.description}
                        </Typography>

                        {/* Price and Book Button */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 'auto',
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                              }}
                            >
                              {property.price.toLocaleString()}đ
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 400, color: 'text.secondary' }}
                            >
                              /đêm
                            </Typography>
                          </Box>
                          
                          <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookNow(property.id);
                            }}
                            sx={{ minWidth: 80 }}
                          >
                            Đặt ngay
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>

            {/* Pagination */}
            {!loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Login Dialog */}
      <LoginDialog />
    </Layout>
  );
};

export default SearchPage;