import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { bannerService } from '../../services/bannerService';

const BannerCarousel = ({ position = 'home_hero' }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBannersByPosition(position);
        console.log('Banner API response:', data);
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        } else {
          // Fallback demo data
          setBanners([
            {
              title: '🎉 Ưu đãi đặc biệt - Giảm 30%',
              description: 'Đặt homestay ngay hôm nay và nhận ngay ưu đãi lên đến 30%',
              button_text: 'Đặt ngay',
              image_url: '/images/homestays/1.jpg'
            },
            {
              title: '🏖️ Nghỉ dưỡng cuối tuần',
              description: 'Trải nghiệm homestay view biển tuyệt đẹp với giá ưu đãi',
              button_text: 'Khám phá',
              image_url: '/images/homestays/2.jpg'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback demo data
        setBanners([
          {
            title: '🎉 Ưu đãi đặc biệt - Giảm 30%',
            description: 'Đặt homestay ngay hôm nay và nhận ngay ưu đãi lên đến 30%',
            button_text: 'Đặt ngay',
            image_url: '/images/homestays/1.jpg'
          },
          {
            title: '🏖️ Nghỉ dưỡng cuối tuần',
            description: 'Trải nghiệm homestay view biển tuyệt đẹp với giá ưu đãi',
            button_text: 'Khám phá',
            image_url: '/images/homestays/2.jpg'
          }
        ]);
      }
    };
    fetchBanners();
  }, [position]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: position === 'hero' ? 400 : 120,
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3,
        background: currentBanner.image_url ? 
          `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentBanner.image_url}) center/cover` :
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.4)'
        }}
      />
      
      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <IconButton
            onClick={() => setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}
      
      <Box sx={{ position: 'relative', zIndex: 1, p: 4, maxWidth: 600 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          {currentBanner.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {currentBanner.description}
        </Typography>
        {currentBanner.button_text && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open(currentBanner.link_url, '_blank')}
          >
            {currentBanner.button_text}
          </Button>
        )}
      </Box>

      {banners.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 1
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BannerCarousel;