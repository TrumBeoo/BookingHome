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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Badge
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Block,
  CheckCircle,
  Schedule,
  Refresh
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';

const RoomCalendarView = ({ rooms, bookings, onDateClick, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Lấy trạng thái phòng cho ngày cụ thể
  const getRoomStatus = (roomId, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const booking = bookings.find(b => 
      b.room_id === roomId && 
      b.check_in <= dateStr && 
      b.check_out > dateStr
    );

    if (booking) {
      switch (booking.status) {
        case 'confirmed':
          return { status: 'booked', color: '#f44336', label: 'Đã đặt' };
        case 'pending':
          return { status: 'pending', color: '#ff9800', label: 'Chờ xác nhận' };
        case 'cancelled':
          return { status: 'available', color: '#4caf50', label: 'Trống' };
        default:
          return { status: 'available', color: '#4caf50', label: 'Trống' };
      }
    }
    return { status: 'available', color: '#4caf50', label: 'Trống' };
  };

  // Lấy số lượng phòng theo trạng thái cho ngày cụ thể
  const getDayStats = (date) => {
    const stats = { available: 0, booked: 0, pending: 0 };
    const filteredRooms = selectedRoom === 'all' ? rooms : rooms.filter(r => r.id === selectedRoom);
    
    filteredRooms.forEach(room => {
      const status = getRoomStatus(room.id, date);
      stats[status.status]++;
    });
    
    return stats;
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
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <Block sx={{ fontSize: 16 }} />;
      case 'pending':
        return <Schedule sx={{ fontSize: 16 }} />;
      default:
        return <CheckCircle sx={{ fontSize: 16 }} />;
    }
  };

  const renderCalendarDay = (date) => {
    const stats = getDayStats(date);
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentDate);
    
    return (
      <Card
        key={date.toString()}
        sx={{
          minHeight: 80,
          cursor: 'pointer',
          opacity: isCurrentMonth ? 1 : 0.3,
          border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.2s ease'
        }}
        onClick={() => handleDateClick(date)}
      >
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
            {format(date, 'd')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
            {stats.available > 0 && (
              <Chip
                size="small"
                label={stats.available}
                sx={{ 
                  backgroundColor: '#4caf50', 
                  color: 'white',
                  height: 16,
                  fontSize: '0.7rem'
                }}
              />
            )}
            {stats.pending > 0 && (
              <Chip
                size="small"
                label={stats.pending}
                sx={{ 
                  backgroundColor: '#ff9800', 
                  color: 'white',
                  height: 16,
                  fontSize: '0.7rem'
                }}
              />
            )}
            {stats.booked > 0 && (
              <Chip
                size="small"
                label={stats.booked}
                sx={{ 
                  backgroundColor: '#f44336', 
                  color: 'white',
                  height: 16,
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handlePrevMonth}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ minWidth: 200, textAlign: 'center' }}>
              {format(currentDate, 'MMMM yyyy', { locale: vi })}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRight />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={handleToday}
              size="small"
            >
              Hôm nay
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            
            <IconButton onClick={onRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Chú thích:</Typography>
          <Chip
            icon={<CheckCircle />}
            label="Trống"
            size="small"
            sx={{ backgroundColor: '#4caf50', color: 'white' }}
          />
          <Chip
            icon={<Schedule />}
            label="Chờ xác nhận"
            size="small"
            sx={{ backgroundColor: '#ff9800', color: 'white' }}
          />
          <Chip
            icon={<Block />}
            label="Đã đặt"
            size="small"
            sx={{ backgroundColor: '#f44336', color: 'white' }}
          />
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        {/* Days of Week Header */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <Grid item xs key={day}>
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'text.secondary',
                  p: 1
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={1}>
          {calendarDays.map(date => (
            <Grid item xs key={date.toString()}>
              {renderCalendarDay(date)}
            </Grid>
          ))}
        </Grid>
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
              <Grid container spacing={2}>
                {(selectedRoom === 'all' ? rooms : rooms.filter(r => r.id === selectedRoom)).map(room => {
                  const status = getRoomStatus(room.id, selectedDate);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                      <Card sx={{ border: `2px solid ${status.color}` }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {room.name}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(status.status)}
                              label={status.label}
                              sx={{ backgroundColor: status.color, color: 'white' }}
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
    </Box>
  );
};

export default RoomCalendarView;