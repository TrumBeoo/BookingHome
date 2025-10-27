import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  AccessTime as TimeIcon,
  Percent as PercentIcon
} from '@mui/icons-material';

const PromotionCard = ({ promotion, onApply, compact = false }) => {
  const getDiscountText = () => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}%`;
    }
    return `${promotion.discount_value.toLocaleString()}đ`;
  };

  const isExpired = new Date(promotion.end_date) < new Date();

  if (compact) {
    return (
      <Chip
        icon={<OfferIcon />}
        label={`🔥 ${promotion.title} - Giảm ${getDiscountText()}`}
        color="error"
        variant="filled"
        sx={{
          fontWeight: 'bold',
          fontSize: '0.9rem',
          height: 'auto',
          py: 1,
          '& .MuiChip-label': {
            px: 1
          }
        }}
      />
    );
  }

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        border: '2px solid #ff4757',
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        transition: 'all 0.3s ease'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: 16,
          backgroundColor: '#ff4757',
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}
      >
        KHUYẾN MÃI
      </Box>

      <CardContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <OfferIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {promotion.title}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {promotion.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            icon={<PercentIcon />}
            label={`Giảm ${getDiscountText()}`}
            color="success"
            variant="filled"
          />
          
          {promotion.min_amount && (
            <Typography variant="caption" color="text.secondary">
              Đơn tối thiểu: {promotion.min_amount.toLocaleString()}đ
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TimeIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Đến {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Mã: {promotion.code}
        </Typography>

        {onApply && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => onApply(promotion)}
            disabled={isExpired}
            sx={{
              backgroundColor: isExpired ? '#ccc' : '#ff4757',
              '&:hover': {
                backgroundColor: isExpired ? '#ccc' : '#ff3742'
              }
            }}
          >
            {isExpired ? 'Đã hết hạn' : 'Áp dụng ngay'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionCard;