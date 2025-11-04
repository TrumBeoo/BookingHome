import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { bannerService } from '../../services/bannerService';

const SidebarBanner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBannersByPosition('home_hero');
        console.log('Banner data:', data);
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        } else {
          // Fallback data
          setBanners([
            {
              title: '🎉 Giảm 20% cho khách đặt lần đầu',
              description: 'Đặt ngay hôm nay để nhận ưu đãi',
              image_url: '/images/homestays/1.jpg'
            },
            {
              title: '🏔️ Khám phá Sa Pa mùa đông',
              description: 'Trải nghiệm không khí se lạnh',
              image_url: '/images/homestays/2.jpg'
            },
            {
              title: '🏖️ Nghỉ dưỡng biển Đà Nẵng',
              description: 'Thư giãn bên bờ biển xanh',
              image_url: '/images/homestays/3.jpg'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback data
        setBanners([
          {
            title: '🎉 Giảm 20% cho khách đặt lần đầu',
            description: 'Đặt ngay hôm nay để nhận ưu đãi',
            image_url: '/images/homestays/1.jpg'
          },
          {
            title: '🏔️ Khám phá Sa Pa mùa đông',
            description: 'Trải nghiệm không khí se lạnh',
            image_url: '/images/homestays/2.jpg'
          },
          {
            title: '🏖️ Nghỉ dưỡng biển Đà Nẵng',
            description: 'Thư giãn bên bờ biển xanh',
            image_url: '/images/homestays/3.jpg'
          }
        ]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (!isVisible || !banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <Box
      onClick={() => navigate('/search')}
      sx={{
        width: '100%',
        height: isVisible ? 80 : 0,
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.4s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 80,
          background: currentBanner.image_url ? 
            `url(${currentBanner.image_url}) center/cover` :
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          transition: 'all 0.8s ease-in-out'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            px: 3,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              {currentBanner.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontSize: '0.9rem',
                opacity: 0.9
              }}
            >
              {currentBanner.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {banners.length > 1 && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {banners.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </Box>
            )}
            
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>


    </Box>
  );
};

export default SidebarBanner;
