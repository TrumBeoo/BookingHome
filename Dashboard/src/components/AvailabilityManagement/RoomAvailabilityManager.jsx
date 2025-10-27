import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  CalendarMonth,
  Sync,
  Settings,
  Warning,
  Refresh
} from '@mui/icons-material';
import RoomCalendarView from './RoomCalendarView';
import BookingConflictChecker from './BookingConflictChecker';
import CalendarIntegration from './CalendarIntegration';
import ApiService from '../../services/api';

const RoomAvailabilityManager = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conflictBooking, setConflictBooking] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [roomsData, bookingsData, integrationsData] = await Promise.all([
        loadRooms(),
        loadBookings(),
        loadIntegrations()
      ]);
      
      setRooms(roomsData);
      setBookings(bookingsData);
      setIntegrations(integrationsData);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      // Simulate API call - replace with actual API
      return [
        {
          id: 1,
          name: 'Phòng Deluxe 101',
          type: 'Deluxe',
          price: 1500000,
          status: 'available'
        },
        {
          id: 2,
          name: 'Phòng Standard 102',
          type: 'Standard',
          price: 1000000,
          status: 'available'
        },
        {
          id: 3,
          name: 'Phòng Suite 201',
          type: 'Suite',
          price: 2500000,
          status: 'maintenance'
        }
      ];
    } catch (error) {
      console.error('Error loading rooms:', error);
      return [];
    }
  };

  const loadBookings = async () => {
    try {
      // Simulate API call - replace with actual API
      const today = new Date();
      const bookings = [];
      
      // Generate sample bookings
      for (let i = 0; i < 20; i++) {
        const checkIn = new Date(today);
        checkIn.setDate(today.getDate() + Math.floor(Math.random() * 60) - 30);
        
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + Math.floor(Math.random() * 7) + 1);
        
        bookings.push({
          id: i + 1,
          room_id: Math.floor(Math.random() * 3) + 1,
          customer_name: `Khách hàng ${i + 1}`,
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
          status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
          created_at: new Date().toISOString()
        });
      }
      
      return bookings;
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [];
    }
  };

  const loadIntegrations = async () => {
    try {
      // Simulate API call - replace with actual API
      return [
        {
          id: 1,
          name: 'Google Calendar - Homestay ABC',
          provider: 'google',
          auto_sync: true,
          sync_interval: 3600,
          connected_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    } catch (error) {
      console.error('Error loading integrations:', error);
      return [];
    }
  };

  const handleDateClick = (date) => {
    // Check for potential conflicts when clicking on a date
    const dateStr = date.toISOString().split('T')[0];
    const dayBookings = bookings.filter(b => 
      b.check_in <= dateStr && b.check_out > dateStr
    );
    
    if (dayBookings.length > 0) {
      console.log('Bookings on this date:', dayBookings);
    }
  };

  const handleConflictResolved = async (resolution, conflicts) => {
    try {
      if (resolution === 'auto') {
        // Cancel pending bookings
        for (const conflict of conflicts) {
          if (conflict.status === 'pending') {
            // await ApiService.updateBooking(conflict.id, { status: 'cancelled' });
            console.log('Auto-cancelled booking:', conflict.id);
          }
        }
      } else if (resolution === 'force') {
        // Create booking anyway with warning flag
        console.log('Force booking with conflicts:', conflicts);
      }
      
      // Reload bookings
      const updatedBookings = await loadBookings();
      setBookings(updatedBookings);
      setConflictBooking(null);
    } catch (error) {
      console.error('Error resolving conflict:', error);
    }
  };

  const handleConnectCalendar = async (provider, config) => {
    try {
      // Simulate API call to save integration
      const newIntegration = {
        id: Date.now(),
        ...config,
        connected_at: new Date().toISOString()
      };
      
      setIntegrations(prev => [...prev, newIntegration]);
      console.log('Connected to', provider, config);
    } catch (error) {
      console.error('Error connecting calendar:', error);
    }
  };

  const handleDisconnectCalendar = async (integrationId) => {
    try {
      // Simulate API call to remove integration
      setIntegrations(prev => prev.filter(i => i.id !== integrationId));
      console.log('Disconnected integration:', integrationId);
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const handleSyncCalendar = async (integrationId) => {
    try {
      // Simulate sync process
      console.log('Syncing calendar:', integrationId);
      
      // Reload bookings after sync
      const updatedBookings = await loadBookings();
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error syncing calendar:', error);
    }
  };

  const handleToggleAutoSync = async (integrationId, enabled) => {
    try {
      setIntegrations(prev => 
        prev.map(i => 
          i.id === integrationId 
            ? { ...i, auto_sync: enabled }
            : i
        )
      );
      console.log('Toggled auto sync:', integrationId, enabled);
    } catch (error) {
      console.error('Error toggling auto sync:', error);
    }
  };

  const getTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <RoomCalendarView
            rooms={rooms}
            bookings={bookings}
            onDateClick={handleDateClick}
            onRefresh={loadData}
          />
        );
      case 1:
        return (
          <CalendarIntegration
            integrations={integrations}
            onConnect={handleConnectCalendar}
            onDisconnect={handleDisconnectCalendar}
            onSync={handleSyncCalendar}
            onToggleAutoSync={handleToggleAutoSync}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Quản Lý Tình Trạng Phòng
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Cập nhật lần cuối: {lastRefresh.toLocaleTimeString('vi-VN')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng số phòng
              </Typography>
              <Typography variant="h4" color="primary">
                {rooms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Phòng trống hôm nay
              </Typography>
              <Typography variant="h4" color="success.main">
                {rooms.filter(r => r.status === 'available').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đặt phòng hôm nay
              </Typography>
              <Typography variant="h4" color="warning.main">
                {bookings.filter(b => {
                  const today = new Date().toISOString().split('T')[0];
                  return b.check_in <= today && b.check_out > today && b.status === 'confirmed';
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tích hợp Calendar
              </Typography>
              <Typography variant="h4" color="info.main">
                {integrations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Conflict Checker */}
      {conflictBooking && (
        <BookingConflictChecker
          newBooking={conflictBooking}
          existingBookings={bookings}
          onConflictResolved={handleConflictResolved}
          onCancel={() => setConflictBooking(null)}
        />
      )}

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<CalendarMonth />}
            label="Lịch Phòng"
            iconPosition="start"
          />
          <Tab
            icon={<Sync />}
            label="Tích Hợp Calendar"
            iconPosition="start"
          />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {getTabContent()}
        </Box>
      </Paper>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={loadData}
      >
        <Refresh />
      </Fab>
    </Box>
  );
};

export default RoomAvailabilityManager;