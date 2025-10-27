import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Skeleton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Weekend as WeekendIcon,
  Event as EventIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import promotionService from '../../services/promotionService';

const DynamicPricing = ({ 
  homestayId, 
  checkIn, 
  checkOut, 
  basePrice, 
  onPriceCalculated 
}) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (homestayId && checkIn && checkOut && basePrice) {
      calculateDynamicPrice();
    }
  }, [homestayId, checkIn, checkOut, basePrice]);

  const calculateDynamicPrice = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await promotionService.calculateDynamicPrice(
        homestayId, 
        checkIn, 
        checkOut, 
        basePrice
      );
      
      setPriceData(result);
      onPriceCalculated && onPriceCalculated(result);
    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      setError('Không thể tính giá động. Sử dụng giá cơ bản.');
      
      // Fallback to basic calculation
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const fallbackData = {
        totalPrice: basePrice * nights,
        nights: nights,
        averagePrice: basePrice,
        priceBreakdown: []
      };
      
      setPriceData(fallbackData);
      onPriceCalculated && onPriceCalculated(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getPriceChangeIcon = (multiplier) => {
    if (multiplier > 1.2) return <TrendingUpIcon sx={{ color: '#f44336', fontSize: 16 }} />;
    if (multiplier > 1) return <TrendingUpIcon sx={{ color: '#ff9800', fontSize: 16 }} />;
    return null;
  };

  const getPriceChangeColor = (multiplier) => {
    if (multiplier > 1.2) return '#f44336';
    if (multiplier > 1) return '#ff9800';
    return '#4caf50';
  };

  const getReasonIcon = (reason) => {
    if (reason.includes('cuối tuần') || reason.includes('Weekend')) {
      return <WeekendIcon sx={{ fontSize: 14 }} />;
    }
    if (reason.includes('lễ') || reason.includes('Holiday')) {
      return <EventIcon sx={{ fontSize: 14 }} />;
    }
    return <OfferIcon sx={{ fontSize: 14 }} />;
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!priceData) return null;

  const hasSpecialPricing = priceData.priceBreakdown.some(day => 
    day.multiplier > 1 || day.surcharge > 0 || day.reasons.length > 0
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          Chi tiết giá ({priceData.nights} đêm)
        </Typography>

        {/* Tổng quan giá */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          mb: 2
        }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Giá trung bình/đêm
            </Typography>
            <Typography variant="h6" color="primary">
              {promotionService.formatPrice(priceData.averagePrice)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Tổng cộng
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {promotionService.formatPrice(priceData.totalPrice)}
            </Typography>
          </Box>
        </Box>

        {/* Cảnh báo giá cao */}
        {hasSpecialPricing && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Giá có thể thay đổi do áp dụng giá cuối tuần, ngày lễ hoặc khuyến mãi đặc biệt.
            </Typography>
          </Alert>
        )}

        {/* Chi tiết từng ngày */}
        {priceData.priceBreakdown.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">
                Xem chi tiết giá từng ngày
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell align="right">Giá gốc</TableCell>
                      <TableCell align="center">Điều chỉnh</TableCell>
                      <TableCell align="right">Giá cuối</TableCell>
                      <TableCell align="center">Lý do</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceData.priceBreakdown.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(day.date).toLocaleDateString('vi-VN', {
                              weekday: 'short',
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {promotionService.formatPrice(day.basePrice)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {getPriceChangeIcon(day.multiplier)}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: getPriceChangeColor(day.multiplier),
                                fontWeight: day.multiplier > 1 ? 600 : 400
                              }}
                            >
                              {day.multiplier > 1 ? `+${Math.round((day.multiplier - 1) * 100)}%` : ''}
                              {day.surcharge > 0 ? ` +${promotionService.formatPrice(day.surcharge)}` : ''}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: day.multiplier > 1 || day.surcharge > 0 ? 600 : 400,
                              color: day.multiplier > 1 || day.surcharge > 0 ? getPriceChangeColor(day.multiplier) : 'inherit'
                            }}
                          >
                            {promotionService.formatPrice(day.finalPrice)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {day.reasons.map((reason, idx) => (
                              <Chip
                                key={idx}
                                label={reason}
                                size="small"
                                variant="outlined"
                                icon={getReasonIcon(reason)}
                                sx={{ 
                                  fontSize: '0.7rem',
                                  height: 20,
                                  '& .MuiChip-icon': {
                                    fontSize: 12
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicPricing;