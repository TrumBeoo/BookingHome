import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Refresh
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import ApiService from '../../services/api';

const SimpleAvailabilityManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const homestayId = 8; // Fixed homestay ID for testing
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    loadAvailabilityData();
  }, [currentDate]);

  const loadAvailabilityData = async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      console.log(`Loading availability for homestay ${homestayId}, month ${month}, year ${year}`);
      
      // Try direct fetch first to debug
      const directResponse = await fetch(`http://localhost:8000/api/availability/quick/${homestayId}?month=${month}&year=${year}`);
      const directData = await directResponse.json();
      
      console.log('Direct API Response:', directData);
      console.log('Availability data keys:', Object.keys(directData.availability || {}));
      
      setAvailabilityData(directData.availability || {});
      
      if (Object.keys(directData.availability || {}).length === 0) {
        showNotification('Không có dữ liệu availability cho tháng này', 'warning');
      } else {
        showNotification(`Đã tải ${Object.keys(directData.availability).length} ngày dữ liệu`, 'success');
      }
      
    } catch (error) {
      console.error('Error loading availability:', error);
      showNotification(`Lỗi tải dữ liệu: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleBlockDates = async (dates) => {
    try {
      const response = await ApiService.request(`/api/availability/block-dates/${homestayId}`, {
        method: 'POST',
        body: JSON.stringify({
          dates: dates.map(d => format(d, 'yyyy-MM-dd')),
          room_ids: null
        })
      });
      
      console.log('Block response:', response);
      showNotification(`Đã chặn thành công: ${response.message}`, 'success');
      
      // Reload dữ liệu sau 500ms để đảm bảo DB đã cập nhật
      setTimeout(() => {
        loadAvailabilityData();
      }, 500);
    } catch (error) {
      console.error('Error blocking dates:', error);
      showNotification(`Lỗi chặn ngày: ${error.message}`, 'error');
    }
  };

  const handleUnblockDates = async (dates) => {
    try {
      const response = await ApiService.request(`/api/availability/unblock-dates/${homestayId}`, {
        method: 'POST',
        body: JSON.stringify({
          dates: dates.map(d => format(d, 'yyyy-MM-dd')),
          room_ids: null
        })
      });
      
      console.log('Unblock response:', response);
      showNotification(`Đã bỏ chặn thành công: ${response.message}`, 'success');
      
      // Reload dữ liệu sau 500ms để đảm bảo DB đã cập nhật
      setTimeout(() => {
        loadAvailabilityData();
      }, 500);
    } catch (error) {
      console.error('Error unblocking dates:', error);
      showNotification(`Lỗi bỏ chặn ngày: ${error.message}`, 'error');
    }
  };

  const getDayData = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availabilityData[dateStr] || {
      status: 'not_set',
      color: '#e0e0e0',
      available_rooms: 0,
      tooltip: 'Chưa thiết lập lịch trống'
    };
  };

  const renderCalendarDay = (date) => {
    const dayData = getDayData(date);
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Debug log for first few days
    if (date.getDate() <= 3) {
      console.log(`Rendering day ${dateStr}:`, dayData);
    }
    
    return (
      <Card
        key={date.toString()}
        sx={{
          minHeight: 60,
          cursor: 'pointer',
          border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
          backgroundColor: dayData.color + '20',
          borderLeft: `4px solid ${dayData.color}`,
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.2s ease'
        }}
        onClick={() => {
          console.log(`Clicked on ${dateStr}:`, dayData);
          setSelectedDate(date);
          setOpenDialog(true);
        }}
      >
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
            {format(date, 'd')}
          </Typography>
          <Typography variant="caption" sx={{ color: dayData.color }}>
            {dayData.status === 'available' ? 'Trống' : 
             dayData.status === 'pending' ? 'Chờ' :
             dayData.status === 'blocked' ? 'Chặn' :
             dayData.status === 'not_set' ? 'Chưa đặt' : 'Đặt'}
          </Typography>
          <Typography variant="caption" display="block" sx={{ fontSize: '10px' }}>
            R: {dayData.available_rooms || 0}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ minWidth: 200, textAlign: 'center' }}>
              {format(currentDate, 'MMMM yyyy', { locale: vi })}
            </Typography>
            <IconButton onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={() => setCurrentDate(new Date())}
              size="small"
            >
              Hôm nay
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Data: {Object.keys(availabilityData).length} days
            </Typography>
            <IconButton onClick={loadAvailabilityData} color="primary" disabled={loading}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <Grid item xs key={day}>
              <Typography variant="subtitle2" sx={{ textAlign: 'center', fontWeight: 'bold', p: 1 }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1}>
          {calendarDays.map(date => (
            <Grid item xs key={date.toString()}>
              {renderCalendarDay(date)}
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Date Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chi tiết ngày {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
        </DialogTitle>
        <DialogContent>
          {selectedDate && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Trạng thái: {getDayData(selectedDate).status}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {getDayData(selectedDate).tooltip}
              </Typography>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleBlockDates([selectedDate]);
                    setOpenDialog(false);
                  }}
                >
                  Chặn ngày này
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleUnblockDates([selectedDate]);
                    setOpenDialog(false);
                  }}
                >
                  Bỏ chặn ngày này
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          severity={notification.severity} 
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimpleAvailabilityManager;