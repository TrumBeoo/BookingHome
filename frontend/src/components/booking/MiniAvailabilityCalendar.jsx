import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  EventAvailable,
  EventBusy,
  Refresh
} from '@mui/icons-material';
import availabilityService from '../../services/availabilityService';


const MiniAvailabilityCalendar = ({ 
  homestayId, 
  roomId, 
  onDateSelect, 
  selectedCheckIn, 
  selectedCheckOut,
  blockedDates = [] 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const calendarDays = [];
  for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
    calendarDays.push(new Date(d));
  }

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  useEffect(() => {
    if (!homestayId) return;
    loadAvailability();
  }, [homestayId, roomId, month, year]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!homestayId) return;
    
    const interval = setInterval(() => {
      loadAvailability();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [homestayId, month, year]);

  const loadAvailability = async () => {
    if (!homestayId) return;
    
    setLoading(true);
    try {
      console.log('Loading availability for homestay:', homestayId, 'month:', month, 'year:', year);
      const response = await availabilityService.getQuickAvailability(homestayId, year, month);
      console.log('API Response:', response);
      
      // Transform API response to expected format
      const availabilityData = {};
      if (response && response.availability) {
        Object.entries(response.availability).forEach(([date, info]) => {
          availabilityData[date] = {
            available: info.status === 'available',
            price: info.min_price,
            status: info.status,
            color: info.color,
            available_rooms: info.available_rooms,
            tooltip: info.tooltip
          };
        });
      }
      
      console.log('Transformed availability data:', availabilityData);
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availability[dateStr];
    
    if (dayData && dayData.available && onDateSelect) {
      onDateSelect(date);
    }
  };



  const renderDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availability[dateStr];
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const dayNumber = date.getDate();
    
    // Get status and color from API data
    const status = dayData?.status || 'unavailable';
    const price = dayData?.price;
    const backgroundColor = dayData?.color || '#bdbdbd';
    const textColor = status === 'available' ? 'white' : '#666';
    
    return (
      <Tooltip
        key={dateStr}
        title={
          dayData?.tooltip || 
          (status === 'available' && price
            ? `${price.toLocaleString('vi-VN')}đ/đêm`
            : 'Không có sẵn')
        }
        arrow
      >
        <Box
          onClick={() => handleDateClick(date)}
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor,
            color: textColor,
            cursor: status === 'available' ? 'pointer' : 'not-allowed',
            borderRadius: 1,
            fontSize: '0.875rem',
            opacity: isCurrentMonth ? 1 : 0.3,
            '&:hover': {
              backgroundColor: status === 'available' ? '#66bb6a' : backgroundColor,
              transform: status === 'available' ? 'scale(1.1)' : 'none'
            },
            transition: 'all 0.2s ease'
          }}
        >
          {dayNumber}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Paper sx={{ p: 2, maxWidth: 300 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={loadAvailability} disabled={loading} title="Làm mới">
            <Refresh sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Days of Week */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <Box key={day} sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary', py: 0.5 }}>
            {day}
          </Box>
        ))}
      </Box>

      {/* Calendar Days */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {calendarDays.map(date => (
          <Box key={date.toString()} sx={{ display: 'flex', justifyContent: 'center' }}>
            {renderDay(date)}
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Chú thích:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 1 }} />
            <Typography variant="caption">Có sẵn</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: 1 }} />
            <Typography variant="caption">Chờ xác nhận</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: 1 }} />
            <Typography variant="caption">Đã đặt</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#9e9e9e', borderRadius: 1 }} />
            <Typography variant="caption">Bị chặn</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MiniAvailabilityCalendar;