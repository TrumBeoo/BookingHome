import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  alpha,
  Card,
  CardContent,
  Stack,

} from '@mui/material';
import { 
  PlayArrow, 
  TrendingUp, 
  Verified, 
  Star,
  LocationOn,
  Group,

} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';


const HeroSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const stats = [
    { icon: <LocationOn />, value: '1000+', label: 'Homestay' },
    { icon: <Group />, value: '50K+', label: 'Khách hàng' },
    { icon: <Star />, value: '4.8', label: 'Đánh giá' },
    { icon: <Verified />, value: '100%', label: 'Uy tín' },
  ];

  return (
    <Box
      sx={{
        background: 'url(/images/homestays/4.jpg) center/cover no-repeat',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '80vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: alpha('#ffffff', 0.1),
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          left: '5%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: alpha('#ffffff', 0.08),
          animation: 'float 4s ease-in-out infinite',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                  background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Khám phá Homestay
                <br />
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#ffeb3b',
                    textShadow: '0 0 20px rgba(255, 235, 59, 0.5)',
                  }}
                >
                  Độc đáo
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                Trải nghiệm lưu trú như người bản địa với hàng ngàn homestay
                được tuyển chọn khắp Việt Nam. Đặt phòng dễ dàng, uy tín 24/7.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<TrendingUp />}
                  sx={{
                    bgcolor: '#ffeb3b',
                    color: '#1976d2',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(255, 235, 59, 0.4)',
                    '&:hover': {
                      bgcolor: '#fdd835',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 235, 59, 0.6)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Khám phá ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha('#ffffff', 0.15),
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Xem video
                </Button>
              </Stack>

              {/* Stats */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha('#ffffff', 0.1),
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: alpha('#ffffff', 0.2),
                      }}
                    >
                      <Box sx={{ color: '#ffeb3b', mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Main Hero Card */}
                <Card
                  sx={{
                    width: 500,
                    height: 450,
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    transform: 'rotate(-5deg)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.05)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      background: "url('/images/homestays/5.jpg') center/cover no-repeat",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                   
                  </Box>
                  
                </Card>

                {/* Floating Mini Cards */}
                <Card
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: -20,
                    width: 120,
                    height: 80,
                    borderRadius: 2,
                    p: 2,
                    bgcolor: alpha('#ffffff', 0.95),
                    backdropFilter: 'blur(10px)',
                    animation: 'float 3s ease-in-out infinite',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    1.2M VNĐ
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    /đêm
                  </Typography>
                </Card>

                <Card
                  sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: -30,
                    width: 180,
                    height: 50,
                    borderRadius: 2,
                    p: 2,
                    bgcolor: alpha('#ffffff', 0.95),
                    backdropFilter: 'blur(10px)',
                    animation: 'float 4s ease-in-out infinite',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#4caf50' }}>
                    ✓ Chất lượng cao
                  </Typography>
                 
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Box sx={{ mt: 8 }}>
          <SearchBar />
        </Box>
      </Container>

    </Box>
  );
};

export default HeroSection;