import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  CreditCard,
  EventAvailable,
  AttachMoney
} from '@mui/icons-material';
import MiniAvailabilityCalendar from './MiniAvailabilityCalendar';
import DateRangePicker from './DateRangePicker';

const BookingFormWithCalendar = ({ 
  homestay, 
  room, 
  onBookingSubmit,
  pricePerNight = 1000000 
}) => {
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequests: ''
  });
  
  const [dateInfo, setDateInfo] = useState({
    nights: 0,
    totalPrice: 0,
    isValid: false
  });
  
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(true);

  const handleDateChange = (dateData) => {
    setBookingData(prev => ({
      ...prev,
      checkIn: dateData.checkIn,
      checkOut: dateData.checkOut
    }));
    
    setDateInfo({
      nights: dateData.nights,
      totalPrice: dateData.totalPrice,
      isValid: dateData.isValid
    });
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData.checkIn) newErrors.checkIn = 'Vui lòng chọn ngày nhận phòng';
    if (!bookingData.checkOut) newErrors.checkOut = 'Vui lòng chọn ngày trả phòng';
    if (!bookingData.customerName.trim()) newErrors.customerName = 'Vui lòng nhập họ tên';
    if (!bookingData.customerPhone.trim()) newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
    if (!bookingData.customerEmail.trim()) newErrors.customerEmail = 'Vui lòng nhập email';
    if (bookingData.guests < 1) newErrors.guests = 'Số khách phải ít nhất 1 người';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (bookingData.customerEmail && !emailRegex.test(bookingData.customerEmail)) {
      newErrors.customerEmail = 'Email không hợp lệ';
    }
    
    // Validate phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (bookingData.customerPhone && !phoneRegex.test(bookingData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Số điện thoại không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && dateInfo.isValid) {
      const finalBookingData = {
        ...bookingData,
        homestayId: homestay?.id,
        roomId: room?.id,
        nights: dateInfo.nights,
        totalPrice: dateInfo.totalPrice,
        pricePerNight
      };
      
      if (onBookingSubmit) {
        onBookingSubmit(finalBookingData);
      }
    }
  };

  const handleCalendarDateSelect = (date) => {
    if (!bookingData.checkIn) {
      setBookingData(prev => ({ ...prev, checkIn: date }));
    } else if (!bookingData.checkOut && date > bookingData.checkIn) {
      setBookingData(prev => ({ ...prev, checkOut: date }));
    } else {
      // Reset and start over
      setBookingData(prev => ({ 
        ...prev, 
        checkIn: date, 
        checkOut: null 
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Đặt phòng - {homestay?.name}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Calendar Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Lịch trống
              </Typography>
              <MiniAvailabilityCalendar
                homestayId={homestay?.id}
                roomId={room?.id}
                onDateSelect={handleCalendarDateSelect}
                selectedCheckIn={bookingData.checkIn}
                selectedCheckOut={bookingData.checkOut}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {/* Date Selection */}
              <DateRangePicker
                homestayId={homestay?.id}
                roomId={room?.id}
                onDateChange={handleDateChange}
                pricePerNight={pricePerNight}
              />

              <Divider sx={{ my: 3 }} />

              {/* Guest Information */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin khách hàng
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số khách"
                    type="number"
                    value={bookingData.guests}
                    onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1, max: room?.max_guests || 10 }}
                    error={!!errors.guests}
                    helperText={errors.guests || `Tối đa ${room?.max_guests || 10} khách`}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={bookingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={bookingData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    error={!!errors.customerPhone}
                    helperText={errors.customerPhone}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={bookingData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    error={!!errors.customerEmail}
                    helperText={errors.customerEmail}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Yêu cầu đặc biệt (tùy chọn)"
                    multiline
                    rows={3}
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Ví dụ: Phòng tầng cao, giường đôi, không hút thuốc..."
                  />
                </Grid>
              </Grid>

              {/* Price Summary */}
              {dateInfo.isValid && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tóm tắt đặt phòng
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Giá phòng/đêm: {pricePerNight.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Số đêm: {dateInfo.nights} đêm
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1, borderColor: 'primary.contrastText' }} />
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney />
                        Tổng tiền: {dateInfo.totalPrice.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!dateInfo.isValid || Object.keys(errors).length > 0}
                  startIcon={<CreditCard />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Đặt phòng ngay
                </Button>
              </Box>

              {!dateInfo.isValid && bookingData.checkIn && bookingData.checkOut && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Vui lòng kiểm tra lại ngày đã chọn. Có thể một số ngày không có sẵn.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingFormWithCalendar;