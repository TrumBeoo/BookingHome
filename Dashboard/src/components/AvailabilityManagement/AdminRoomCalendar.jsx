import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Calendar } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { availabilityService } from '../../../services/availabilityService';
import dayjs from 'dayjs';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info';

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  width: '100%',
  '& .MuiPickersDay-root': {
    position: 'relative',
    minHeight: '50px',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 2,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: 3,
      borderRadius: 2
    }
  }
}));

const AdminRoomCalendar = ({ homestayId, roomId }) => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [homestayId, selectedMonth]);

  const fetchAvailability = async () => {
    try {
      const data = await availabilityService.getCalendar(
        homestayId,
        selectedMonth.year(),
        selectedMonth.month() + 1,
        roomId
      );
      setAvailabilityData(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleBlockDate = async (date) => {
    try {
      await availabilityService.blockDates(homestayId, [date], roomId ? [roomId] : null);
      fetchAvailability();
    } catch (error) {
      console.error('Error blocking date:', error);
    }
  };

  const handleUnblockDate = async (date) => {
    try {
      await availabilityService.unblockDates(homestayId, [date], roomId ? [roomId] : null);
      fetchAvailability();
    } catch (error) {
      console.error('Error unblocking date:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDetailsOpen(true);
  };

  const renderDay = (date, selectedDates, pickersDayProps) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dayData = availabilityData?.days?.find(d => d.date === dateStr);

    if (!dayData) {
      return <div {...pickersDayProps} />;
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'available':
          return '#4caf50';
        case 'pending':
          return '#ff9800';
        case 'blocked':
          return '#9e9e9e';
        case 'booked':
          return '#f44336';
        default:
          return '#000';
      }
    };

    const tooltipContent = (
      <Box>
        <Typography variant="body2">
          Trạng thái: {
            dayData.status === 'available' ? 'Còn trống' :
            dayData.status === 'pending' ? 'Chờ xác nhận' :
            dayData.status === 'blocked' ? 'Đã chặn' : 'Đã đặt'
          }
        </Typography>
        {dayData.price && (
          <Typography variant="body2">
            Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dayData.price)}
          </Typography>
        )}
        {dayData.booking_info && (
          <>
            <Typography variant="body2">
              Mã đặt phòng: {dayData.booking_info.booking_code}
            </Typography>
            <Typography variant="body2">
              Khách: {dayData.booking_info.guest_name}
            </Typography>
          </>
        )}
      </Box>
    );

    return (
      <Tooltip title={tooltipContent} arrow>
        <Box
          {...pickersDayProps}
          onClick={() => handleDateClick(dateStr)}
          sx={{
            backgroundColor: dayData.status === 'available' ? '#e8f5e9' :
                           dayData.status === 'pending' ? '#fff3e0' :
                           dayData.status === 'blocked' ? '#eeeeee' : '#ffebee',
            color: '#000',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1
          }}
        >
          <Typography>{date.date()}</Typography>
          <Box
            sx={{
              width: '80%',
              height: 3,
              backgroundColor: getStatusColor(dayData.status),
              borderRadius: 2,
              mt: 'auto'
            }}
          />
        </Box>
      </Tooltip>
    );
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  const DateDetailsDialog = () => {
    if (!selectedDate || !availabilityData) return null;

    const dayData = availabilityData.days.find(d => d.date === selectedDate);
    if (!dayData) return null;

    return (
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chi tiết ngày {dayjs(selectedDate).format('DD/MM/YYYY')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Trạng thái: {
                  dayData.status === 'available' ? 'Còn trống' :
                  dayData.status === 'pending' ? 'Chờ xác nhận' :
                  dayData.status === 'blocked' ? 'Đã chặn' : 'Đã đặt'
                }
              </Typography>
            </Grid>
            {dayData.price && (
              <Grid item xs={12}>
                <Typography>
                  Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dayData.price)}
                </Typography>
              </Grid>
            )}
            {dayData.booking_info && (
              <>
                <Grid item xs={12}>
                  <Typography>
                    Mã đặt phòng: {dayData.booking_info.booking_code}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Khách: {dayData.booking_info.guest_name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Số khách: {dayData.booking_info.guests}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          {dayData.status !== 'booked' && (
            <Button
              startIcon={dayData.status === 'blocked' ? <LockOpenIcon /> : <LockIcon />}
              onClick={() => {
                if (dayData.status === 'blocked') {
                  handleUnblockDate(selectedDate);
                } else {
                  handleBlockDate(selectedDate);
                }
                setDetailsOpen(false);
              }}
              color={dayData.status === 'blocked' ? 'primary' : 'warning'}
            >
              {dayData.status === 'blocked' ? 'Bỏ chặn ngày này' : 'Chặn ngày này'}
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (!availabilityData) {
    return <Typography>Đang tải lịch phòng...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Quản lý lịch phòng</Typography>
        <Tooltip title="Thống kê tháng">
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <StyledCalendar
          value={selectedMonth}
          onChange={handleMonthChange}
          renderDay={renderDay}
          views={['day']}
        />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: 1 }} />
          <Typography variant="body2">Còn trống ({availabilityData.total_available})</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: 1 }} />
          <Typography variant="body2">Chờ xác nhận</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: 1 }} />
          <Typography variant="body2">Đã đặt ({availabilityData.total_booked})</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#9e9e9e', borderRadius: 1 }} />
          <Typography variant="body2">Đã chặn</Typography>
        </Box>
      </Box>

      <DateDetailsDialog />
    </Paper>
  );
};

export default AdminRoomCalendar;