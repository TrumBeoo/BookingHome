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
      }, 2000);
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
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}
    >
      {banners.map((banner, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: banner.image_url ? 
              `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image_url}) center/cover` :
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0
          }}
        />
      ))}
      
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
              zIndex: 3,
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
              zIndex: 3,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}
      
      <Box sx={{ position: 'relative', zIndex: 2, p: 4, maxWidth: 600 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            animation: 'fadeInUp 0.8s ease-out'
          }}
        >
          {currentBanner.title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
          }}
        >
          {currentBanner.description}
        </Typography>
        {currentBanner.button_text && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open(currentBanner.link_url, '_blank')}
            sx={{
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
              '&:hover': { transform: 'scale(1.05)' },
              transition: 'transform 0.2s'
            }}
          >
            {currentBanner.button_text}
          </Button>
        )}
      </Box>
      
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {banners.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 1,
            zIndex: 3
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
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.2)',
                  bgcolor: 'white'
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BannerCarousel;