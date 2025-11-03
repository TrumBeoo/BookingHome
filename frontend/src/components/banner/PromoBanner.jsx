import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { bannerService } from '../../services/bannerService';

const PromoBanner = ({ position = 'home_below_search' }) => {
  const [banner, setBanner] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBannersByPosition(position);
        console.log('Promo banner API response:', data);
        if (data.banners && data.banners.length > 0) {
          setBanner(data.banners[0]);
        } else {
          // Fallback demo data
          setBanner({
            title: 'Giảm 20% cho khách đặt lần đầu trong tuần này!',
            discount_text: 'WELCOME20'
          });
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback demo data
        setBanner({
          title: 'Giảm 20% cho khách đặt lần đầu trong tuần này!',
          discount_text: 'WELCOME20'
        });
      }
    };
    fetchBanners();
  }, [position]);

  if (!banner || !visible) return null;

  return (
    <Box
      sx={{
        bgcolor: '#ff5722',
        color: 'white',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 1,
        mb: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {banner.title}
        </Typography>
        {banner.discount_text && (
          <Chip
            label={banner.discount_text}
            sx={{ bgcolor: 'white', color: '#ff5722', fontWeight: 'bold' }}
          />
        )}
      </Box>
      
      <IconButton
        size="small"
        onClick={() => setVisible(false)}
        sx={{ color: 'white' }}
      >
        <Close />
      </IconButton>
    </Box>
  );
};

export default PromoBanner;