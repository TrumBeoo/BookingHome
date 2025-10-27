import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, CircularProgress, Box } from '@mui/material';
import Layout from '../common/Layout';
import BookingFormWithCalendar from './BookingFormWithCalendar';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const BookingPageWithCalendar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchHomestay();
  }, [id, isAuthenticated, navigate]);

  const fetchHomestay = async () => {
    try {
      setLoading(true);
      const response = await api.getHomestay(id);
      setHomestay(response.homestay);
    } catch (error) {
      console.error('Error fetching homestay:', error);
      setError('Không thể tải thông tin homestay');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      console.log('Booking data:', bookingData);
      
      // Simulate API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            bookingId: 'BK' + Date.now(),
            message: 'Đặt phòng thành công!'
          });
        }, 2000);
      });
      
      if (response.success) {
        navigate(`/booking-success/${response.bookingId}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <BookingFormWithCalendar
          homestay={homestay}
          room={homestay}
          onBookingSubmit={handleBookingSubmit}
          pricePerNight={homestay?.price_per_night || 1000000}
        />
      </Container>
    </Layout>
  );
};

export default BookingPageWithCalendar;