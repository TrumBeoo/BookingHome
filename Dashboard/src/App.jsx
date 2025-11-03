import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { dashboardTheme } from './theme/dashboardTheme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import Overview from './pages/Dashboard/Overview';
import Properties from './pages/Dashboard/Properties';
import Bookings from './pages/Dashboard/Bookings';
import Analytics from './pages/Dashboard/Analytics';

// Import new pages (placeholder components)
import UserManagement from './pages/Dashboard/UserManagement';
import HomestayManagement from './pages/Dashboard/HomestayManagement';
import BookingManagement from './pages/Dashboard/BookingManagement';
import PaymentManagement from './pages/Dashboard/PaymentManagement';
import ReviewManagement from './pages/Dashboard/ReviewManagement';
import ContentManagement from './pages/Dashboard/ContentManagement';
import Statistics from './pages/Dashboard/Statistics';
import Support from './pages/Dashboard/Support';
import SystemSettings from './pages/Dashboard/SystemSettings';
import RoomCategoryManagement from './pages/Dashboard/RoomCategoryManagement';

import RoomAvailabilityPage from './pages/RoomAvailabilityPage';

function App() {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/properties" element={
              <ProtectedRoute>
                <Properties />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/bookings/pending" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/bookings/confirmed" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/bookings/cancelled" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            
            {/* User Management Routes */}
            <Route path="/dashboard/users/*" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            {/* Homestay Management Routes */}
            <Route path="/dashboard/homestays/*" element={
              <ProtectedRoute>
                <HomestayManagement />
              </ProtectedRoute>
            } />
            
            {/* Booking Management Routes */}
            <Route path="/dashboard/bookings/*" element={
              <ProtectedRoute>
                <BookingManagement />
              </ProtectedRoute>
            } />
            
            {/* Payment Management Routes */}
            <Route path="/dashboard/payments/*" element={
              <ProtectedRoute>
                <PaymentManagement />
              </ProtectedRoute>
            } />
            
            {/* Review Management Routes */}
            <Route path="/dashboard/reviews/*" element={
              <ProtectedRoute>
                <ReviewManagement />
              </ProtectedRoute>
            } />
            
            {/* Content Management Routes */}
            <Route path="/dashboard/content/*" element={
              <ProtectedRoute>
                <ContentManagement />
              </ProtectedRoute>
            } />
            
            {/* Statistics Routes */}
            <Route path="/dashboard/statistics/*" element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            } />
            
            {/* Support Routes */}
            <Route path="/dashboard/support/*" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            
            {/* Room Category Management Routes */}
            <Route path="/dashboard/room-categories" element={
              <ProtectedRoute>
                <RoomCategoryManagement />
              </ProtectedRoute>
            } />
            

            
            {/* Room Availability Management Routes */}
            <Route path="/dashboard/room-availability" element={
              <ProtectedRoute>
                <RoomAvailabilityPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/room-availability/*" element={
              <ProtectedRoute>
                <RoomAvailabilityPage />
              </ProtectedRoute>
            } />
            
            {/* System Settings Routes */}
            <Route path="/dashboard/system/*" element={
              <ProtectedRoute>
                <SystemSettings />
              </ProtectedRoute>
            } />
          
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;