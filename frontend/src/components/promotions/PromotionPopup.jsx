import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import { Close as CloseIcon, LocalOffer as OfferIcon } from '@mui/icons-material';

const PromotionPopup = ({ open, onClose, promotion }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!promotion?.end_date) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(promotion.end_date).getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Đã hết hạn');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [promotion?.end_date]);

  if (!promotion) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', p: 4 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 3 }}>
          <OfferIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            🎉 {promotion.title}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {promotion.description}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={`Giảm ${promotion.discount_type === 'percentage' ? promotion.discount_value + '%' : promotion.discount_value.toLocaleString() + 'đ'}`}
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: '#ff4757',
              color: 'white',
              px: 2,
              py: 1
            }}
          />
        </Box>

        {timeLeft && (
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
            ⏰ Còn lại: {timeLeft}
          </Typography>
        )}

        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Mã: <strong>{promotion.code}</strong>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={onClose}
          sx={{
            backgroundColor: 'white',
            color: '#667eea',
            fontWeight: 'bold',
            px: 4,
            '&:hover': {
              backgroundColor: '#f1f1f1'
            }
          }}
        >
          Đặt ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionPopup;