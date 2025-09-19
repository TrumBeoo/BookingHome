import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  LocationOn,
  Favorite,
  FavoriteBorder,
  Star,
} from '@mui/icons-material';

const FeaturedProperties = () => {
  const featuredProperties = [
    {
      id: 1,
      name: 'Villa Sapa View',
      location: 'Sa Pa, Lào Cai',
      price: '1,200,000',
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/200',
      features: ['WiFi', 'Bữa sáng', 'View núi'],
      liked: false,
    },
    {
      id: 2,
      name: 'Homestay Hội An',
      location: 'Hội An, Quảng Nam',
      price: '800,000',
      rating: 4.9,
      reviews: 89,
      image: '/api/placeholder/300/200',
      features: ['Xe đạp', 'Pool', 'Trung tâm'],
      liked: true,
    },
    {
      id: 3,
      name: 'Bungalow Phú Quốc',
      location: 'Phú Quốc, Kiên Giang',
      price: '1,500,000',
      rating: 4.7,
      reviews: 156,
      image: '/api/placeholder/300/200',
      features: ['Bãi biển', 'BBQ', 'Kayak'],
      liked: false,
    },
    {
      id: 4,
      name: 'Nhà sàn Mai Châu',
      location: 'Mai Châu, Hòa Bình',
      price: '600,000',
      rating: 4.6,
      reviews: 73,
      image: '/api/placeholder/300/200',
      features: ['Truyền thống', 'Trekking', 'Văn hóa'],
      liked: false,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Homestay Nổi Bật
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Khám phá những homestay được yêu thích nhất với trải nghiệm độc đáo
          và dịch vụ chất lượng cao
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {featuredProperties.map((property) => (
          <Grid item xs={12} sm={6} md={3} key={property.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {/* Image */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Property Image
                  </Typography>
                </CardMedia>
                
                {/* Heart Icon */}
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
                >
                  {property.liked ? (
                    <Favorite sx={{ color: 'red' }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
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

                {/* Features */}
                <Box sx={{ mb: 2 }}>
                  {property.features.slice(0, 3).map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        fontSize: '0.75rem',
                        bgcolor: 'primary.light',
                        color: 'white',
                      }}
                    />
                  ))}
                </Box>

                {/* Price */}
                <Box sx={{ mt: 'auto' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                    }}
                  >
                    {property.price.toLocaleString()}đ
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ fontWeight: 400, color: 'text.secondary' }}
                    >
                      /đêm
                    </Typography>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" sx={{ mt: 6 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
          }}
        >
          Xem tất cả homestay
        </Button>
      </Box>
    </Container>
  );
};

export default FeaturedProperties;