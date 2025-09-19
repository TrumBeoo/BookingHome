import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { LocationOn, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';

const DestinationsPage = () => {
  const navigate = useNavigate();

  const destinations = [
    {
      id: 1,
      name: 'Sa Pa',
      province: 'Lào Cai',
      properties: 156,
      averagePrice: 1200000,
      image: '/api/placeholder/400/300',
      trending: true,
      description: 'Thị trấn núi nổi tiếng với ruộng bậc thang và văn hóa dân tộc đa dạng',
    },
    {
      id: 2,
      name: 'Hội An',
      province: 'Quảng Nam',
      properties: 234,
      averagePrice: 800000,
      image: '/api/placeholder/400/300',
      trending: true,
      description: 'Phố cổ di sản với kiến trúc độc đáo và ẩm thực phong phú',
    },
    {
      id: 3,
      name: 'Đà Lạt',
      province: 'Lâm Đồng',
      properties: 189,
      averagePrice: 1000000,
      image: '/api/placeholder/400/300',
      trending: false,
      description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm',
    },
    {
      id: 4,
      name: 'Phú Quốc',
      province: 'Kiên Giang',
      properties: 98,
      averagePrice: 1500000,
      image: '/api/placeholder/400/300',
      trending: true,
      description: 'Đảo ngọc với bãi biển đẹp và hải sản tươi ngon',
    },
    {
      id: 5,
      name: 'Ninh Bình',
      province: 'Ninh Bình',
      properties: 67,
      averagePrice: 900000,
      image: '/api/placeholder/400/300',
      trending: false,
      description: 'Tràng An - Di sản thiên nhiên với cảnh quan hùng vĩ',
    },
    {
      id: 6,
      name: 'Hạ Long',
      province: 'Quảng Ninh',
      properties: 123,
      averagePrice: 1100000,
      image: '/api/placeholder/400/300',
      trending: true,
      description: 'Vịnh di sản thế giới với hàng nghìn đảo đá vôi kỳ thú',
    },
  ];

  const handleDestinationClick = (destination) => {
    navigate(`/search?location=${destination.name}`);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Khám Phá Các Điểm Đến
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Từ núi rừng hùng vĩ đến bãi biển trong xanh, Việt Nam có vô số địa điểm 
            tuyệt đẹp đang chờ bạn khám phá
          </Typography>
        </Box>

        {/* Destinations Grid */}
        <Grid container spacing={4}>
          {destinations.map((destination) => (
            <Grid item xs={12} sm={6} md={4} key={destination.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleDestinationClick(destination)}
              >
                {/* Trending Badge */}
                {destination.trending && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'secondary.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                 <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    Hot
                  </Box>
                )}

                {/* Image */}
                <CardMedia
                  component="div"
                  sx={{
                    height: 240,
                    position: 'relative',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                    {destination.name} Image
                  </Typography>
                  
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {destination.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LocationOn sx={{ color: 'white', fontSize: 16, mr: 0.5, opacity: 0.9 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          opacity: 0.9,
                        }}
                      >
                        {destination.province}
                      </Typography>
                    </Box>
                  </Box>
                </CardMedia>

                <CardContent sx={{ p: 3 }}>
                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {destination.description}
                  </Typography>

                  {/* Stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      {destination.properties} homestay
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      Từ {(destination.averagePrice / 1000000).toFixed(1)}M đ/đêm
                    </Typography>
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    Khám phá ngay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 8,
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
            }}
          >
            Không tìm thấy điểm đến yêu thích?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Hãy liên hệ với chúng tôi để được tư vấn về những địa điểm du lịch 
            tuyệt vời khác trên khắp Việt Nam
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'secondary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
            }}
            onClick={() => navigate('/contact')}
          >
            Liên hệ tư vấn
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default DestinationsPage;