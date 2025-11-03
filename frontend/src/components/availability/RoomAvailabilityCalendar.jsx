import React, { useState, useEffect } from 'react';
import { Calendar } from '@mui/x-date-pickers';
import { Paper, Typography, Tooltip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { availabilityService } from '../../services/availabilityService';
import dayjs from 'dayjs';

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  width: '100%',
  '& .MuiPickersDay-root': {
    position: 'relative',
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

const RoomAvailabilityCalendar = ({ homestayId, roomId }) => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await availabilityService.getQuickAvailability(
          homestayId,
          selectedMonth.month() + 1,
          selectedMonth.year()
        );
        setAvailabilityData(data);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [homestayId, selectedMonth]);

  const renderDay = (date, selectedDates, pickersDayProps) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dayData = availabilityData?.availability?.[dateStr];

    if (!dayData) {
      return <div {...pickersDayProps} />;
    }

    const tooltipContent = (
      <Box>
        <Typography variant="body2">{dayData.tooltip}</Typography>
        {dayData.min_price && (
          <Typography variant="body2">
            Giá từ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dayData.min_price)}
          </Typography>
        )}
      </Box>
    );

    return (
      <Tooltip title={tooltipContent} arrow>
        <div
          {...pickersDayProps}
          style={{
            backgroundColor: dayData.status === 'available' ? '#e8f5e9' :
                           dayData.status === 'pending' ? '#fff3e0' : '#ffebee',
            color: '#000',
            position: 'relative'
          }}
        >
          {date.date()}
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: 3,
              backgroundColor: dayData.color,
              borderRadius: 2
            }}
          />
        </div>
      </Tooltip>
    );
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  if (!availabilityData) {
    return <Typography>Đang tải lịch phòng...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lịch phòng trống
      </Typography>
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
          <Typography variant="body2">Còn trống</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: 1 }} />
          <Typography variant="body2">Chờ xác nhận</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: 1 }} />
          <Typography variant="body2">Đã đặt</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoomAvailabilityCalendar;