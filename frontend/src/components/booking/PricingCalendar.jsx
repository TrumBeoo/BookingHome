import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Weekend as WeekendIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';

const PricingCalendar = ({ 
  basePrice, 
  onPriceChange, 
  selectedDates = [],
  availablePromotions = []
}) => {
  const [priceType, setPriceType] = useState('normal');
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [selectedPromotion, setSelectedPromotion] = useState('');

  // Định nghĩa các loại giá
  const priceTypes = {
    normal: { label: 'Ngày thường', multiplier: 1, color: '#4caf50' },
    weekend: { label: 'Cuối tuần', multiplier: 1.3, color: '#ff9800' },
    holiday: { label: 'Ngày lễ', multiplier: 1.8, color: '#f44336' }
  };

  // Danh sách ngày lễ Việt Nam 2024
  const holidays = [
    { date: '2024-01-01', name: 'Tết Dương lịch' },
    { date: '2024-02-10', name: 'Tết Nguyên đán' },
    { date: '2024-02-11', name: 'Tết Nguyên đán' },
    { date: '2024-02-12', name: 'Tết Nguyên đán' },
    { date: '2024-04-18', name: 'Giỗ Tổ Hùng Vương' },
    { date: '2024-04-30', name: 'Ngày Giải phóng miền Nam' },
    { date: '2024-05-01', name: 'Quốc tế Lao động' },
    { date: '2024-09-02', name: 'Quốc khánh' }
  ];

  useEffect(() => {
    let finalPrice = basePrice * priceTypes[priceType].multiplier;
    
    // Áp dụng khuyến mãi nếu có
    if (selectedPromotion) {
      const promotion = availablePromotions.find(p => p.id === selectedPromotion);
      if (promotion) {
        if (promotion.discount_type === 'percentage') {
          finalPrice = finalPrice * (1 - promotion.discount_value / 100);
        } else {
          finalPrice = Math.max(0, finalPrice - promotion.discount_value);
        }
      }
    }

    setCurrentPrice(finalPrice);
    
    // Chỉ gọi onPriceChange nếu finalPrice thay đổi
    const priceInfo = {
      basePrice,
      priceType,
      finalPrice,
      promotion: selectedPromotion ? availablePromotions.find(p => p.id === selectedPromotion) : null
    };
    
    if (onPriceChange && finalPrice !== currentPrice) {
      onPriceChange(priceInfo);
    }
  }, [basePrice, priceType, selectedPromotion]);

  const detectDateType = (date) => {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const dateString = dateObj.toISOString().split('T')[0];
    
    // Kiểm tra ngày lễ
    if (holidays.some(h => h.date === dateString)) {
      return 'holiday';
    }
    
    // Kiểm tra cuối tuần (Thứ 7 = 6, Chủ nhật = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'weekend';
    }
    
    return 'normal';
  };

  const getDateTypeInfo = (date) => {
    const type = detectDateType(date);
    const holiday = holidays.find(h => h.date === new Date(date).toISOString().split('T')[0]);
    
    return {
      type,
      name: holiday?.name || priceTypes[type].label,
      price: basePrice * priceTypes[type].multiplier
    };
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon color="primary" />
          Bảng giá động
        </Typography>

        {/* Thanh trượt chọn loại giá */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Chọn loại ngày:
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(priceTypes).map(([key, type]) => (
              <Grid item xs={4} key={key}>
                <Button
                  fullWidth
                  variant={priceType === key ? 'contained' : 'outlined'}
                  onClick={() => setPriceType(key)}
                  sx={{
                    backgroundColor: priceType === key ? type.color : 'transparent',
                    borderColor: type.color,
                    color: priceType === key ? 'white' : type.color,
                    '&:hover': {
                      backgroundColor: type.color,
                      color: 'white'
                    }
                  }}
                >
                  {key === 'weekend' && <WeekendIcon sx={{ mr: 1, fontSize: 16 }} />}
                  {key === 'holiday' && <EventIcon sx={{ mr: 1, fontSize: 16 }} />}
                  {type.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Hiển thị giá hiện tại */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 2, 
          mb: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            color: priceTypes[priceType].color,
            mb: 1
          }}>
            {currentPrice.toLocaleString()}đ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {priceTypes[priceType].label} 
            {priceType !== 'normal' && (
              <span> (+{Math.round((priceTypes[priceType].multiplier - 1) * 100)}%)</span>
            )}
          </Typography>
        </Box>

        {/* Chọn khuyến mãi */}
        {availablePromotions.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Chọn khuyến mãi</InputLabel>
            <Select
              value={selectedPromotion}
              onChange={(e) => setSelectedPromotion(e.target.value)}
              label="Chọn khuyến mãi"
            >
              <MenuItem value="">
                <em>Không áp dụng</em>
              </MenuItem>
              {availablePromotions.map((promotion) => (
                <MenuItem key={promotion.id} value={promotion.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <OfferIcon fontSize="small" />
                    {promotion.title} - Giảm {promotion.discount_type === 'percentage' 
                      ? `${promotion.discount_value}%` 
                      : `${promotion.discount_value.toLocaleString()}đ`}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Hiển thị thông tin ngày đã chọn */}
        {selectedDates.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Chi tiết giá theo ngày đã chọn:
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {selectedDates.map((date, index) => {
                const dateInfo = getDateTypeInfo(date);
                return (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #eee'
                  }}>
                    <Box>
                      <Typography variant="body2">
                        {new Date(date).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Chip 
                        label={dateInfo.name}
                        size="small"
                        sx={{ 
                          backgroundColor: priceTypes[dateInfo.type].color,
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {dateInfo.price.toLocaleString()}đ
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingCalendar;