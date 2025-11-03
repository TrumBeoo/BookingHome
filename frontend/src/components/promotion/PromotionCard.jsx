import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { LocalOffer, AccessTime } from '@mui/icons-material';

const PromotionCard = ({ promotion, onApply }) => {
  const getDiscountText = () => {
    if (promotion.discount_type === 'percentage') {
      return `Giảm ${promotion.discount_value}%`;
    } else {
      return `Giảm ${promotion.discount_value.toLocaleString()}đ`;
    }
  };

  const daysUntilEnd = () => {
    const end = new Date(promotion.end_date);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Discount Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -12,
          left: 16,
          bgcolor: 'error.main',
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: 1,
          boxShadow: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <LocalOffer fontSize="small" />
        <Typography variant="body2" fontWeight="bold">
          {getDiscountText()}
        </Typography>
      </Box>

      <CardContent sx={{ pt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {promotion.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {promotion.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {promotion.min_amount > 0 && (
            <Typography variant="body2" color="text.secondary">
              Áp dụng cho đơn từ: {promotion.min_amount.toLocaleString()}đ
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Còn {daysUntilEnd()} ngày
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Chip
            label={promotion.code}
            variant="outlined"
            color="primary"
            size="small"
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => onApply(promotion)}
          >
            Áp dụng
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;