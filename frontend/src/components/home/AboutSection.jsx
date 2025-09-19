import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Security,
  SupportAgent,
  Verified,
  TravelExplore,
} from '@mui/icons-material';

const AboutSection = () => {
  const features = [
    {
      icon: <Security />,
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin cá nhân và thanh toán được bảo vệ với công nghệ mã hóa tiên tiến',
    },
    {
      icon: <Verified />,
      title: 'Chất lượng đã kiểm định',
      description: 'Tất cả homestay đều được kiểm tra và xác minh chất lượng trước khi đăng tải',
    },
    {
      icon: <SupportAgent />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi',
    },
    {
      icon: <TravelExplore />,
      title: 'Trải nghiệm độc đáo',
      description: 'Khám phá văn hóa địa phương qua những homestay đặc sắc và chủ nhà thân thiện',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Tại sao chọn Homestay Hub?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Chúng tôi cam kết mang đến cho bạn những trải nghiệm lưu trú tuyệt vời nhất
            với sự an tâm và tiện lợi tối đa
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3,
                    fontSize: 28,
                  }}
                >
                  {feature.icon}
                </Avatar>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                  }}
                >
                  {feature.title}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Statistics */}
        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3} textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                10K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Homestay
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={3} textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                50K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Khách hàng
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={3} textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                4.9★
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Đánh giá
              </Typography>
            </Grid>
            
            <Grid item xs={6} md={3} textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                63
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Tỉnh thành
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;