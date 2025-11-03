import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const SidebarPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (window.scrollY > 300 && !visible) {
          setVisible(true);
        }
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        right: 20,
        transform: 'translateY(-50%)',
        width: 280,
        bgcolor: '#ff5722',
        color: 'white',
        borderRadius: 2,
        p: 2,
        zIndex: 1000,
        boxShadow: 3
      }}
    >
      <IconButton
        size="small"
        onClick={() => setVisible(false)}
        sx={{ position: 'absolute', top: 4, right: 4, color: 'white' }}
      >
        <Close />
      </IconButton>
      
      <Typography variant="h6" sx={{ mb: 1, pr: 3 }}>
        🔥 Giảm 10% khi đặt tối thiểu 2 đêm
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Ưu đãi có thời hạn. Đặt ngay để không bỏ lỡ!
      </Typography>
      <Button
        variant="contained"
        size="small"
        fullWidth
        sx={{ bgcolor: 'white', color: '#ff5722', '&:hover': { bgcolor: '#f5f5f5' } }}
        onClick={() => setVisible(false)}
      >
        Áp dụng ngay
      </Button>
    </Box>
  );
};

export default SidebarPopup;