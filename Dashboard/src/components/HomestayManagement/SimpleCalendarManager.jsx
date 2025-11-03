import React, { useState, useEffect } from 'react';
import {
  Box,
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
  CircularProgress,
  Paper,
  Alert
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Refresh
} from '@mui/icons-material';
import { format, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import ApiService from '../../services/api';

const SimpleCalendarManager = ({ homestay, showSnackbar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create calendar days manually to avoid timezone issues
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  useEffect(() => {
    if (homestay?.id) {
      loadAvailabilityData();
    }
  }, [currentDate, homestay?.id]);

  const loadAvailabilityData = async () => {
    if (!homestay?.id) return;
    
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      console.log(`Loading availability for homestay ${homestay.id}, month ${month}, year ${year}`);
      
      const response = await ApiService.getQuickAvailability(homestay.id, month, year);
      
      console.log('Availability response:', response);
      setAvailabilityData(response.availability || {});
      
      if (Object.keys(response.availability || {}).length === 0) {
        showSnackbar('Không có dữ liệu availability cho tháng này', 'warning');
      }
      
    } catch (error) {
      console.error('Error loading availability:', error);
      showSnackbar(`Lỗi tải dữ liệu: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDate = async (date) => {
    // Format using UTC to avoid timezone issues
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
    console.log(`Blocking date: ${dateStr} (original: ${date})`);
    
    try {
      await ApiService.blockDates(homestay.id, [dateStr]);
      showSnackbar('Đã chặn ngày thành công', 'success');
      setTimeout(() => loadAvailabilityData(), 500);
    } catch (error) {
      console.error('Block date error:', error);
      showSnackbar(`Lỗi chặn ngày: ${error.message}`, 'error');
    }
  };

  const handleUnblockDate = async (date) => {
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
    console.log(`Unblocking date: ${dateStr} (original: ${date})`);
    
    try {
      await ApiService.unblockDates(homestay.id, [dateStr]);
      showSnackbar('Đã bỏ chặn ngày thành công', 'success');
      setTimeout(() => loadAvailabilityData(), 500);
    } catch (error) {
      console.error('Unblock date error:', error);
      showSnackbar(`Lỗi bỏ chặn ngày: ${error.message}`, 'error');
    }
  };

  const getDayData = (date) => {
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    return availabilityData[dateStr] || {
      status: 'not_set',
      color: '#e0e0e0',
      available_rooms: 0,
      tooltip: 'Chưa thiết lập lịch trống'
    };
  };

  const renderCalendarDay = (date) => {
    const dayData = getDayData(date);
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    
    // Debug log for specific dates
    if (dateStr === '2025-10-06' || dateStr === '2025-10-07') {
      console.log(`Rendering ${dateStr}:`, dayData, 'Date object:', date);
    }
    
    return (
      <Card
        key={date.toString()}
        sx={{
          minHeight: 80,
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
          const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
          console.log(`Clicked date: ${dateStr}`, date);
          setSelectedDate(date);
          setOpenDialog(true);
        }}
      >
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
            {date.getUTCDate()}
          </Typography>
          <Typography variant="caption" sx={{ color: dayData.color }}>
            {dayData.status === 'available' ? 'Trống' : 
             dayData.status === 'pending' ? 'Chờ' :
             dayData.status === 'blocked' ? 'Chặn' :
             dayData.status === 'not_set' ? 'Chưa đặt' : 'Đặt'}
          </Typography>
          <Typography variant="caption" display="block" sx={{ fontSize: '10px' }}>
            Phòng: {dayData.available_rooms || 0}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (!homestay) {
    return (
      <Alert severity="info">
        Vui lòng chọn một homestay để quản lý lịch trống
      </Alert>
    );
  }

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
              Homestay: {homestay.name} | Data: {Object.keys(availabilityData).length} days
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

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={1}>
            {calendarDays.map(date => (
              <Grid item xs key={date.toString()}>
                {renderCalendarDay(date)}
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Date Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chi tiết ngày {selectedDate && `${String(selectedDate.getUTCDate()).padStart(2, '0')}/${String(selectedDate.getUTCMonth() + 1).padStart(2, '0')}/${selectedDate.getUTCFullYear()}`}
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
                    handleBlockDate(selectedDate);
                    setOpenDialog(false);
                  }}
                >
                  Chặn ngày này
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleUnblockDate(selectedDate);
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
    </Box>
  );
};

export default SimpleCalendarManager;