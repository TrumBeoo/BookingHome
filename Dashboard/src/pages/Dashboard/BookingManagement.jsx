import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingsList from '../../components/BookingManagement/BookingsList';

// Components for different booking statuses
const AllBookings = () => <BookingsList statusFilter="all" />;
const PendingBookings = () => <BookingsList statusFilter="pending" />;
const ConfirmedBookings = () => <BookingsList statusFilter="confirmed" />;
const CancelledBookings = () => <BookingsList statusFilter="cancelled" />;
const BookingHistory = () => <BookingsList statusFilter="all" />;

const BookingManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Tất cả', path: '/dashboard/bookings', component: <AllBookings /> },
    { label: 'Chờ xác nhận', path: '/dashboard/bookings/pending', component: <PendingBookings /> },
    { label: 'Đã xác nhận', path: '/dashboard/bookings/confirmed', component: <ConfirmedBookings /> },
    { label: 'Đã hủy', path: '/dashboard/bookings/cancelled', component: <CancelledBookings /> },
    { label: 'Lịch sử', path: '/dashboard/bookings/history', component: <BookingHistory /> },
  ];

  const currentTab = tabs.findIndex(tab => location.pathname === tab.path);

  const handleTabChange = (event, newValue) => {
    navigate(tabs[newValue].path);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Quản lý Đặt phòng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý tất cả đặt phòng, xác nhận booking và theo dõi lịch sử
          </Typography>
        </Box>

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={currentTab >= 0 ? currentTab : 0}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<AllBookings />} />
              <Route path="pending" element={<PendingBookings />} />
              <Route path="confirmed" element={<ConfirmedBookings />} />
              <Route path="cancelled" element={<CancelledBookings />} />
              <Route path="history" element={<BookingHistory />} />
              <Route path="*" element={<AllBookings />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default BookingManagement;