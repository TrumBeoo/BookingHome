import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { bannerService } from '../../services/bannerService';

const SlideshowCard = ({ position = 'home_hero' }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBannersByPosition(position);
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        } else {
          setBanners([
            {
              title: 'Ưu đãi đặc biệt',
              description: 'Giảm 30% cho đặt phòng đầu tiên',
              button_text: 'Đặt ngay',
              image_url: '/images/homestays/1.jpg'
            },
            {
              title: 'Nghỉ dưỡng cuối tuần',
              description: 'Trải nghiệm homestay view biển tuyệt đẹp',
              button_text: 'Khám phá',
              image_url: '/images/homestays/2.jpg'
            }
          ]);
        }
      } catch (error) {
        setBanners([
          {
            title: 'Ưu đãi đặc biệt',
            description: 'Giảm 30% cho đặt phòng đầu tiên',
            button_text: 'Đặt ngay',
            image_url: '/images/homestays/1.jpg'
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
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <Card
      sx={{
        position: 'relative',
        height: 280,
        borderRadius: 3,
        overflow: 'hidden',
        mb: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.16)'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: currentBanner.image_url 
            ? `url(${currentBanner.image_url})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.5s ease',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)'
          }
        }}
      />

      <CardContent
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <Box>
          <Chip
            label="Ưu đãi"
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              mb: 2
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            {currentBanner.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              maxWidth: 400,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)'
            }}
          >
            {currentBanner.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {banners.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>

          {banners.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SlideshowCard;
