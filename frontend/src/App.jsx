import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

import Home from './components/home/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/Register';

import SearchPage from './components/search/SearchPage';
import PropertyDetail from './components/property/PropertyDetail';
import BookingPage from './components/booking/BookingPage';
import BookingPageWithCalendar from './components/booking/BookingPageWithCalendar';
import BookingSuccess from './components/booking/BookingSuccess';
import UserProfile from './components/user/UserProfile';
import BlogPage from './components/blog/BlogPage';
import ContactPage from './components/support/ContactPage';
import DestinationsPage from './components/destinations/DestinationsPage';
import AboutPage from './components/about/AboutPage';
import RoomCategories from './components/RoomCategories/RoomCategories';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTopOnRouteChange from './components/common/ScrollToTopOnRouteChange';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <ScrollToTopOnRouteChange />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/room-categories" element={<RoomCategories />} />

            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route path="/property/:id/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="/property/:id/booking-calendar" element={<ProtectedRoute><BookingPageWithCalendar /></ProtectedRoute>} />
            <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/host" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/help" element={<ContactPage />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;