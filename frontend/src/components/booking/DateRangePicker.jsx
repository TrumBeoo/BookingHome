import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Alert,
  Typography,
  Chip,
  Paper
} from '@mui/material';
import {
  CalendarMonth,
  EventAvailable,
  AttachMoney
} from '@mui/icons-material';


const DateRangePicker = ({ 
  homestayId,
  roomId,
  onDateChange,
  blockedDates = [],
  pricePerNight = 0,
  minStay = 1
}) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [availability, setAvailability] = useState({});
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (homestayId) {
      loadAvailability();
    }
  }, [homestayId, roomId]);

  useEffect(() => {
    if (checkIn && checkOut) {
      calculateTotal();
      validateDates();
    }
  }, [checkIn, checkOut, availability]);

  const loadAvailability = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockData = {};
      const today = new Date();
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(today.getTime() + i * 86400000);
        const dateStr = date.toISOString().split('T')[0];
        const isBlocked = blockedDates.includes(dateStr);
        
        mockData[dateStr] = {
          available: !isBlocked && Math.random() > 0.2,
          price: pricePerNight + (Math.random() * 200000 - 100000)
        };
      }
      
      setAvailability(mockData);
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const validateDates = () => {
    setError('');
    
    if (!checkIn || !checkOut) return;
    
    if (checkOut <= checkIn) {
      setError('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }
    
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (nights < minStay) {
      setError(`Tối thiểu phải ở ${minStay} đêm`);
      return;
    }
    
    // If all validations pass, notify parent
    if (onDateChange) {
      onDateChange({
        checkIn,
        checkOut,
        nights,
        totalPrice,
        isValid: true
      });
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) {
      setTotalPrice(0);
      return;
    }
    
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total = nights * pricePerNight;
    setTotalPrice(total);
  };



  const nights = checkIn && checkOut ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonth />
        Chọn ngày nhận và trả phòng
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Ngày nhận phòng"
            value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const newValue = e.target.value ? new Date(e.target.value) : null;
              setCheckIn(newValue);
              if (newValue && checkOut && !isAfter(checkOut, newValue)) {
                setCheckOut(null);
              }
            }}
            InputLabelProps={{ shrink: true }}
            helperText="Chọn ngày bắt đầu lưu trú"
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Ngày trả phòng"
            value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const newValue = e.target.value ? new Date(e.target.value) : null;
              setCheckOut(newValue);
            }}
            disabled={!checkIn}
            InputLabelProps={{ shrink: true }}
            helperText={checkIn ? 'Chọn ngày kết thúc lưu trú' : 'Vui lòng chọn ngày nhận phòng trước'}
            inputProps={{
              min: checkIn ? new Date(checkIn.getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }}
          />
        </Grid>
      </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {checkIn && checkOut && !error && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Thông tin đặt phòng
              </Typography>
              <Chip
                icon={<EventAvailable />}
                label="Có sẵn"
                color="success"
                size="small"
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Nhận phòng:</strong> {checkIn.toLocaleDateString('vi-VN')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Trả phòng:</strong> {checkOut.toLocaleDateString('vi-VN')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Số đêm:</strong> {nights} đêm
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AttachMoney sx={{ fontSize: 16 }} />
                  <strong>Tổng tiền:</strong> {totalPrice.toLocaleString('vi-VN')}đ
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {checkIn && !checkOut && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Vui lòng chọn ngày trả phòng để hoàn tất việc đặt phòng
          </Alert>
        )}
      </Box>
  );
};

export default DateRangePicker;