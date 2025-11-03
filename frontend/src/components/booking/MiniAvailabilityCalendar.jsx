// frontend/src/components/booking/MiniAvailabilityCalendar.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Refresh
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import availabilityService from '../../services/availabilityService';
import { dateUtils } from '../../utils/dateUtils';

const MiniAvailabilityCalendar = ({ 
  homestayId, 
  roomId, 
  onDateSelect, 
  selectedCheckIn, 
  selectedCheckOut 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    if (homestayId) {
      loadAvailability();
    }
  }, [homestayId, roomId, currentDate]);

  const loadAvailability = async () => {
    if (!homestayId) return;
    
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const response = await availabilityService.getQuickAvailability(
        homestayId, 
        year, 
        month
      );
      
      // Transform to date-keyed object
      const availabilityMap = {};
      if (response?.availability) {
        Object.entries(response.availability).forEach(([date, info]) => {
          availabilityMap[date] = {
            available: info.status === 'available',
            price: info.min_price,
            status: info.status,
            color: info.color,
            tooltip: info.tooltip
          };
        });
      }
      
      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = dateUtils.formatDateForAPI(date);
    const dayData = availability[dateStr];
    
    // Không cho phép chọn ngày blocked hoặc booked
    if (dayData?.available && dayData?.status === 'available' && onDateSelect) {
      onDateSelect(date);
    }
  };

  const renderDay = (date) => {
    const dateStr = dateUtils.formatDateForAPI(date);
    const dayData = availability[dateStr];
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    
    const isSelected = 
      (selectedCheckIn && dateUtils.formatDateForAPI(selectedCheckIn) === dateStr) ||
      (selectedCheckOut && dateUtils.formatDateForAPI(selectedCheckOut) === dateStr);
    
    const isInRange = selectedCheckIn && selectedCheckOut &&
      date >= selectedCheckIn && date <= selectedCheckOut;
    
    const isBlocked = dayData?.status === 'blocked' || dayData?.status === 'booked';
    
    const backgroundColor = isSelected ? '#1976d2' :
                          isInRange ? '#e3f2fd' :
                          dayData?.color || '#e0e0e0';
    
    const textColor = isSelected ? 'white' : 
                     (dayData?.available && !isBlocked) ? '#000' : '#999';

    return (
      <Tooltip
        key={dateStr}
        title={dayData?.tooltip || 'Not available'}
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
            backgroundColor: backgroundColor + (isCurrentMonth ? 'FF' : '40'),
            color: textColor,
            cursor: (dayData?.available && !isBlocked) ? 'pointer' : 'not-allowed',
            borderRadius: 1,
            fontSize: '0.875rem',
            fontWeight: isSelected ? 'bold' : 'normal',
            opacity: isCurrentMonth ? 1 : 0.3,
            textDecoration: isBlocked ? 'line-through' : 'none',
            '&:hover': {
              backgroundColor: (dayData?.available && !isBlocked) ? '#66bb6a' : backgroundColor,
              transform: (dayData?.available && !isBlocked) ? 'scale(1.1)' : 'none'
            },
            transition: 'all 0.2s ease',
            border: isSelected ? '2px solid #1976d2' : 'none'
          }}
        >
          {date.getDate()}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Paper sx={{ p: 2, maxWidth: 300 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton size="small" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {format(currentDate, 'MMMM yyyy', { locale: vi })}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={loadAvailability} disabled={loading}>
            <Refresh sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
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
        {/* Empty cells for days before month start */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <Box key={`empty-${i}`} sx={{ width: 32, height: 32 }} />
        ))}
        
        {/* Actual calendar days */}
        {calendarDays.map(date => (
          <Box key={date.toString()} sx={{ display: 'flex', justifyContent: 'center' }}>
            {renderDay(date)}
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Legend:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 1 }} />
            <Typography variant="caption">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: 1 }} />
            <Typography variant="caption">Booked</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#9e9e9e', borderRadius: 1 }} />
            <Typography variant="caption">Blocked</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: 1 }} />
            <Typography variant="caption">Selected</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MiniAvailabilityCalendar;