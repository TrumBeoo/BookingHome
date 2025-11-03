import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Block,
  CheckCircle,
  Schedule,
  Refresh,
  CalendarToday,
  Sync,
  Settings
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import ApiService from '../../services/api';

const EnhancedCalendarView = ({ homestayId, rooms, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    loadAvailabilityData();
  }, [currentDate, homestayId]);

  useEffect(() => {
    if (autoSync) {
      const interval = setInterval(() => {
        loadAvailabilityData();
        showNotification('Đã đồng bộ lịch tự động', 'success');
      }, 300000); // 5 phút
      setSyncInterval(interval);
    } else if (syncInterval) {
      clearInterval(syncInterval);
      setSyncInterval(null);
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [autoSync]);

  const loadAvailabilityData = async () => {
    if (!homestayId) return;
    
    setLoading(true);
    try {
      const response = await ApiService.get(`/api/availability/quick/${homestayId}`, {
        params: {
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }
      });
      setAvailabilityData(response.data.availability || {});
    } catch (error) {
      console.error('Error loading availability:', error);
      showNotification('Không thể tải dữ liệu lịch', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  const handleBlockDates = async (dates, roomIds = null) => {
    try {
      await ApiService.post(`/api/availability/block-dates/${homestayId}`, {
        dates: dates.map(d => format(d, 'yyyy-MM-dd')),
        room_ids: roomIds
      });
      
      showNotification('Đã chặn ngày thành công', 'success');
      loadAvailabilityData();
    } catch (error) {
      console.error('Error blocking dates:', error);
      showNotification('Không thể chặn ngày', 'error');
    }
  };

  const handleUnblockDates = async (dates, roomIds = null) => {
    try {
      await ApiService.post(`/api/availability/unblock-dates/${homestayId}`, {
        dates: dates.map(d => format(d, 'yyyy-MM-dd')),
        room_ids: roomIds
      });
      
      showNotification('Đã bỏ chặn ngày thành công', 'success');
      loadAvailabilityData();
    } catch (error) {
      console.error('Error unblocking dates:', error);
      showNotification('Không thể bỏ chặn ngày', 'error');
    }
  };

  const getDayData = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availabilityData[dateStr] || {
      status: 'available',
      color: '#4caf50',
      available_rooms: 0,
      booked_rooms: 0,
      pending_rooms: 0,
      tooltip: 'Không có dữ liệu'
    };
  };

  const renderCalendarDay = (date) => {
    const dayData = getDayData(date);
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentDate);
    
    return (
      <Tooltip
        key={date.toString()}
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {format(date, 'dd/MM/yyyy')}
            </Typography>
            <Typography variant="body2">{dayData.tooltip}</Typography>
            {dayData.min_price && (
              <Typography variant="body2">
                Giá từ: {dayData.min_price.toLocaleString('vi-VN')}đ
              </Typography>
            )}
          </Box>
        }
        arrow
        placement="top"
      >
        <Card
          sx={{
            minHeight: 80,
            cursor: 'pointer',
            opacity: isCurrentMonth ? 1 : 0.3,
            border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
            backgroundColor: dayData.color + '20', // Thêm độ trong suốt
            borderLeft: `4px solid ${dayData.color}`,
            '&:hover': {
              boxShadow: 2,
              transform: 'translateY(-2px)',
              backgroundColor: dayData.color + '40'
            },
            transition: 'all 0.2s ease'
          }}
          onClick={() => handleDateClick(date)}
        >
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: isToday ? 'bold' : 'normal',
                color: isToday ? '#1976d2' : 'inherit'
              }}
            >
              {format(date, 'd')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
              {dayData.available_rooms > 0 && (
                <Chip
                  size="small"
                  label={`T: ${dayData.available_rooms}`}
                  sx={{ 
                    backgroundColor: '#4caf50', 
                    color: 'white',
                    height: 16,
                    fontSize: '0.6rem'
                  }}
                />
              )}
              {dayData.pending_rooms > 0 && (
                <Chip
                  size="small"
                  label={`C: ${dayData.pending_rooms}`}
                  sx={{ 
                    backgroundColor: '#ff9800', 
                    color: 'white',
                    height: 16,
                    fontSize: '0.6rem'
                  }}
                />
              )}
              {dayData.booked_rooms > 0 && (
                <Chip
                  size="small"
                  label={`Đ: ${dayData.booked_rooms}`}
                  sx={{ 
                    backgroundColor: '#f44336', 
                    color: 'white',
                    height: 16,
                    fontSize: '0.6rem'
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Tooltip>
    );
  };

  const renderWeekView = () => {
    const weeks = [];
    const startDate = startOfMonth(currentDate);
    let currentWeek = [];
    
    calendarDays.forEach((date, index) => {
      currentWeek.push(date);
      
      if (currentWeek.length === 7 || index === calendarDays.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return weeks.map((week, weekIndex) => (
      <Grid container spacing={1} key={weekIndex} sx={{ mb: 1 }}>
        {week.map(date => (
          <Grid item xs key={date.toString()}>
            {renderCalendarDay(date)}
          </Grid>
        ))}
      </Grid>
    ));
  };

  return (
    <Box>
      {/* Header Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handlePrevMonth} disabled={loading}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ minWidth: 200, textAlign: 'center' }}>
              {format(currentDate, 'MMMM yyyy', { locale: vi })}
            </Typography>
            <IconButton onClick={handleNextMonth} disabled={loading}>
              <ChevronRight />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={handleToday}
              size="small"
              disabled={loading}
            >
              Hôm nay
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  size="small"
                />
              }
              label="Đồng bộ tự động"
            />
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Lọc theo phòng</InputLabel>
              <Select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                label="Lọc theo phòng"
              >
                <MenuItem value="all">Tất cả phòng</MenuItem>
                {rooms.map(room => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <IconButton onClick={loadAvailabilityData} color="primary" disabled={loading}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Chú thích:</Typography>
          <Chip
            icon={<CheckCircle />}
            label="Trống (T)"
            size="small"
            sx={{ backgroundColor: '#4caf50', color: 'white' }}
          />
          <Chip
            icon={<Schedule />}
            label="Chờ xác nhận (C)"
            size="small"
            sx={{ backgroundColor: '#ff9800', color: 'white' }}
          />
          <Chip
            icon={<Block />}
            label="Đã đặt (Đ)"
            size="small"
            sx={{ backgroundColor: '#f44336', color: 'white' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            * Rê chuột vào ngày để xem chi tiết
          </Typography>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        {/* Days of Week Header */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day, index) => (
            <Grid item xs key={day}>
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: index === 0 || index === 6 ? 'error.main' : 'text.secondary',
                  p: 1
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Đang tải...</Typography>
          </Box>
        ) : (
          renderWeekView()
        )}
      </Paper>

      {/* Date Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event />
            Chi tiết ngày {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDate && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Trạng thái phòng
              </Typography>
              
              {/* Quick Actions */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleBlockDates([selectedDate])}
                >
                  Chặn ngày này
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() => handleUnblockDates([selectedDate])}
                >
                  Bỏ chặn ngày này
                </Button>
              </Box>

              <Grid container spacing={2}>
                {(selectedRoom === 'all' ? rooms : rooms.filter(r => r.id === selectedRoom)).map(room => {
                  const dayData = getDayData(selectedDate);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                      <Card sx={{ border: `2px solid ${dayData.color}` }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {room.name}
                            </Typography>
                            <Chip
                              label={dayData.status === 'available' ? 'Trống' : dayData.status === 'pending' ? 'Chờ' : 'Đặt'}
                              sx={{ backgroundColor: dayData.color, color: 'white' }}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Loại: {room.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Giá: {room.price?.toLocaleString('vi-VN')}đ/đêm
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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

export default EnhancedCalendarView;