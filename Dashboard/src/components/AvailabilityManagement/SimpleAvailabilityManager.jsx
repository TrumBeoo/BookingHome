// Dashboard/src/components/AvailabilityManagement/SimpleAvailabilityManager.jsx
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
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Refresh,
  Block,
  CheckCircle
} from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import ApiService from '../../services/api';
import { dateUtils } from '../../utils/dateUtils';

const SimpleAvailabilityManager = ({ homestay, showSnackbar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

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
      
      const response = await ApiService.get(
        `/api/availability/calendar/${homestay.id}`,
        { params: { month, year } }
      );
      
      // Transform calendar data to lookup object
      const dataLookup = {};
      response.days.forEach(day => {
        dataLookup[day.date] = {
          ...day.rooms[0], // Assuming single room for simplicity
          statistics: response.statistics
        };
      });
      
      setAvailabilityData(dataLookup);
      showSnackbar?.(`Loaded ${response.days.length} days`, 'success');
    } catch (error) {
      console.error('Error loading availability:', error);
      showSnackbar?.(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDates = async (dates) => {
    const formattedDates = dates.map(d => dateUtils.formatDateForAPI(d));
    
    try {
      const response = await ApiService.post(
        `/api/availability/bulk-update/${homestay.id}`,
        {
          dates: formattedDates,
          room_ids: null,
          reason: 'Blocked by admin'
        }
      );
      
      showSnackbar?.(response.message, 'success');
      setSelectedDates([]);
      setBulkMode(false);
      setTimeout(() => loadAvailabilityData(), 500);
    } catch (error) {
      showSnackbar?.(`Error: ${error.message}`, 'error');
    }
  };

  const handleUnblockDates = async (dates) => {
    const formattedDates = dates.map(d => dateUtils.formatDateForAPI(d));
    
    try {
      await ApiService.post(`/api/availability/unblock-dates/${homestay.id}`, {
        dates: formattedDates,
        room_ids: null
      });
      
      showSnackbar?.('Unblocked successfully', 'success');
      setSelectedDates([]);
      setBulkMode(false);
      setTimeout(() => loadAvailabilityData(), 500);
    } catch (error) {
      showSnackbar?.(`Error: ${error.message}`, 'error');
    }
  };

  const getDayData = (date) => {
    const dateStr = dateUtils.formatDateForAPI(date);
    return availabilityData[dateStr] || {
      status: 'not_set',
      color: '#e0e0e0',
      tooltip: 'Not set'
    };
  };

  const handleDateClick = (date) => {
    if (bulkMode) {
      // Toggle selection in bulk mode
      const dateStr = dateUtils.formatDateForAPI(date);
      const existing = selectedDates.find(d => dateUtils.formatDateForAPI(d) === dateStr);
      
      if (existing) {
        setSelectedDates(selectedDates.filter(d => dateUtils.formatDateForAPI(d) !== dateStr));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    } else {
      // Single date selection
      setSelectedDate(date);
      setOpenDialog(true);
    }
  };

  const renderCalendarDay = (date) => {
    const dayData = getDayData(date);
    const dateStr = dateUtils.formatDateForAPI(date);
    const today = new Date();
    const isToday = dateUtils.formatDateForAPI(today) === dateStr;
    const isSelected = selectedDates.some(d => dateUtils.formatDateForAPI(d) === dateStr);
    
    return (
      <Tooltip key={dateStr} title={dayData.tooltip} arrow>
        <Card
          sx={{
            minHeight: 80,
            cursor: 'pointer',
            border: isToday ? '2px solid #1976d2' : isSelected ? '2px solid #ff9800' : '1px solid #e0e0e0',
            backgroundColor: isSelected ? '#fff3e0' : dayData.color + '20',
            borderLeft: `4px solid ${dayData.color}`,
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
              {date.getDate()}
            </Typography>
            <Typography variant="caption" sx={{ color: dayData.color, display: 'block' }}>
              {dayData.status === 'available' ? 'Free' : 
               dayData.status === 'blocked' ? 'Blocked' :
               dayData.status === 'booked' ? 'Booked' : 'N/A'}
            </Typography>
            {dayData.price && (
              <Typography variant="caption" sx={{ fontSize: '10px', display: 'block' }}>
                {(dayData.price / 1000).toFixed(0)}K
              </Typography>
            )}
          </CardContent>
        </Card>
      </Tooltip>
    );
  };

  if (!homestay) {
    return (
      <Alert severity="info">
        Please select a homestay to manage availability
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
              Today
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={bulkMode ? 'Bulk Mode ON' : 'Single Mode'} 
              color={bulkMode ? 'warning' : 'default'}
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedDates([]);
              }}
            />
            {bulkMode && selectedDates.length > 0 && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<Block />}
                  onClick={() => handleBlockDates(selectedDates)}
                >
                  Block ({selectedDates.length})
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => handleUnblockDates(selectedDates)}
                >
                  Unblock ({selectedDates.length})
                </Button>
              </>
            )}
            <IconButton onClick={loadAvailabilityData} color="primary" disabled={loading}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>
        
        {/* Statistics */}
        {availabilityData[Object.keys(availabilityData)[0]]?.statistics && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Available: ${availabilityData[Object.keys(availabilityData)[0]].statistics.available}`} 
              color="success" 
              size="small" 
            />
            <Chip 
              label={`Booked: ${availabilityData[Object.keys(availabilityData)[0]].statistics.booked}`} 
              color="error" 
              size="small" 
            />
            <Chip 
              label={`Blocked: ${availabilityData[Object.keys(availabilityData)[0]].statistics.blocked}`} 
              color="default" 
              size="small" 
            />
            <Chip 
              label={`Occupancy: ${availabilityData[Object.keys(availabilityData)[0]].statistics.occupancy_rate}%`} 
              color="info" 
              size="small" 
            />
          </Box>
        )}
      </Paper>

      {/* Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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
            {/* Fill empty days at start */}
            {Array.from({ length: calendarDays[0].getDay() }).map((_, i) => (
              <Grid item xs key={`empty-${i}`}>
                <Box sx={{ minHeight: 80 }} />
              </Grid>
            ))}
            
            {/* Calendar days */}
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
          Date Details: {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
        </DialogTitle>
        <DialogContent>
          {selectedDate && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Status: {getDayData(selectedDate).status}
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
                  Block this date
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleUnblockDates([selectedDate]);
                    setOpenDialog(false);
                  }}
                >
                  Unblock this date
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimpleAvailabilityManager;