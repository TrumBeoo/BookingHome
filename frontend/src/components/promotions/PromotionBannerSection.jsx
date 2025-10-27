import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PromotionBannerSection = () => {
  const navigate = useNavigate();

  const promotions = [
    {
      title: 'Giảm 30% mùa thu',
      description: 'Áp dụng cho tất cả homestay',
      code: 'AUTUMN30',
      discount: '30%',
      color: '#ff4757',
      bgGradient: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)'
    },
    {
      title: 'Combo 3N2Đ',
      description: 'Đặt 3 đêm chỉ tính 2 đêm',
      code: 'COMBO3N2D',
      discount: '33%',
      color: '#2ed573',
      bgGradient: 'linear-gradient(135deg, #2ed573 0%, #17c0eb 100%)'
    },
    {
      title: 'Weekend Special',
      description: 'Giảm giá cuối tuần',
      code: 'WEEKEND20',
      discount: '20%',
      color: '#ffa502',
      bgGradient: 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)'
    }
  ];

  return (
    <Box sx={{ 
      py: 6, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: 'white',
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎉 Ưu đãi đặc biệt hôm nay
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 600,
            mx: 'auto'
          }}>
            Đừng bỏ lỡ cơ hội tiết kiệm lên đến 30% cho chuyến du lịch của bạn
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {promotions.map((promo, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{
                background: promo.bgGradient,
                color: 'white',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent sx={{ p: 3, position: 'relative' }}>
                  {/* Floating icon */}
                  <Box sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <OfferIcon sx={{ fontSize: 30 }} />
                  </Box>

                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {promo.discount}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1 
                  }}>
                    {promo.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    mb: 3,
                    opacity: 0.9
                  }}>
                    {promo.description}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 3 
                  }}>
                    <Chip 
                      label={promo.code}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        Còn 5 ngày
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/search')}
                    sx={{
                      backgroundColor: 'white',
                      color: promo.color,
                      fontWeight: 'bold',
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    Đặt ngay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to action */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<TrendingIcon />}
            onClick={() => navigate('/search')}
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderWidth: 2,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderWidth: 2
              }
            }}
          >
            Xem tất cả ưu đãi
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PromotionBannerSection;