import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const FloatingPromo = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10000); // Hiện sau 10 giây

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 300,
        bgcolor: 'white',
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        zIndex: 1000,
        border: '2px solid #ff5722'
      }}
    >
      <IconButton
        size="small"
        onClick={() => setVisible(false)}
        sx={{ position: 'absolute', top: 4, right: 4 }}
      >
        <Close />
      </IconButton>
      
      <Typography variant="h6" sx={{ color: '#ff5722', mb: 1 }}>
        🎉 Ưu đãi đặc biệt!
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Giảm 15% cho đơn đặt phòng đầu tiên. Áp dụng ngay hôm nay!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        onClick={() => setVisible(false)}
      >
        Xem ngay
      </Button>
    </Box>
  );
};

export default FloatingPromo;