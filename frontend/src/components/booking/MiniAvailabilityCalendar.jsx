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
  EventBusy
} from '@mui/icons-material';


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

  useEffect(() => {
    if (homestayId) {
      loadAvailability();
    }
  }, [homestayId, roomId, currentDate]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const mockData = {};
      const today = new Date();
      
      calendarDays.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        const isBlocked = blockedDates.includes(dateStr);
        const isPast = day < today;
        
        mockData[dateStr] = {
          available: !isBlocked && !isPast && Math.random() > 0.3,
          price: Math.floor(Math.random() * 1000000) + 500000
        };
      });
      
      setAvailability(mockData);
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

  const getDayStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availability[dateStr];
    const today = new Date();
    
    if (date < today) {
      return { status: 'past', color: '#f5f5f5', textColor: '#bdbdbd' };
    }
    
    if (!dayData || !dayData.available) {
      return { status: 'unavailable', color: '#ffebee', textColor: '#f44336' };
    }
    
    if (selectedCheckIn && date.toDateString() === selectedCheckIn.toDateString()) {
      return { status: 'checkin', color: '#e3f2fd', textColor: '#1976d2' };
    }
    
    if (selectedCheckOut && date.toDateString() === selectedCheckOut.toDateString()) {
      return { status: 'checkout', color: '#e8f5e8', textColor: '#388e3c' };
    }
    
    if (selectedCheckIn && selectedCheckOut && 
        date > selectedCheckIn && date < selectedCheckOut) {
      return { status: 'between', color: '#f3e5f5', textColor: '#7b1fa2' };
    }
    
    return { status: 'available', color: '#ffffff', textColor: '#333333' };
  };

  const renderDay = (date) => {
    const dayStatus = getDayStatus(date);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availability[dateStr];
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const dayNumber = date.getDate();
    
    return (
      <Tooltip
        key={dateStr}
        title={
          dayData && dayData.available 
            ? `${dayData.price?.toLocaleString('vi-VN')}đ/đêm`
            : 'Không có sẵn'
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
            backgroundColor: dayStatus.color,
            color: dayStatus.textColor,
            cursor: dayData && dayData.available ? 'pointer' : 'not-allowed',
            borderRadius: 1,
            fontSize: '0.875rem',
            fontWeight: dayStatus.status === 'checkin' || dayStatus.status === 'checkout' ? 'bold' : 'normal',
            opacity: isCurrentMonth ? 1 : 0.3,
            border: dayStatus.status === 'checkin' || dayStatus.status === 'checkout' ? '2px solid' : 'none',
            borderColor: dayStatus.status === 'checkin' ? '#1976d2' : dayStatus.status === 'checkout' ? '#388e3c' : 'transparent',
            '&:hover': {
              backgroundColor: dayData && dayData.available ? '#e3f2fd' : dayStatus.color,
              transform: dayData && dayData.available ? 'scale(1.1)' : 'none'
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
        <IconButton size="small" onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Days of Week */}
      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <Grid item xs key={day}>
            <Box sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary', py: 0.5 }}>
              {day}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Days */}
      <Grid container spacing={0.5}>
        {calendarDays.map(date => (
          <Grid item xs key={date.toString()}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {renderDay(date)}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Legend */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Chú thích:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventAvailable sx={{ fontSize: 16, color: '#4caf50' }} />
            <Typography variant="caption">Có sẵn</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventBusy sx={{ fontSize: 16, color: '#f44336' }} />
            <Typography variant="caption">Đã đặt</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MiniAvailabilityCalendar;