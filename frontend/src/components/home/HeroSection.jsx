import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchBar from './SearchBar';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Khám phá Homestay
              <br />
              <Box component="span" sx={{ color: 'secondary.main' }}>
                Độc đáo
              </Box>
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: 4,
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Trải nghiệm lưu trú như người bản địa với hàng ngàn homestay
              được tuyển chọn khắp Việt Nam
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
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
              >
                Khám phá ngay
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 400,
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="h6" sx={{ opacity: 0.7 }}>
                    Hero Image Placeholder
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Box sx={{ mt: 6 }}>
          <SearchBar />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;