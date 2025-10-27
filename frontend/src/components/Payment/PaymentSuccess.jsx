import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { CheckCircle, Home, Receipt } from '@mui/icons-material';
import Layout from '../common/Layout';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, pricing, property, bookingId, paymentResult } = location.state || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <Box sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}>
        <Card sx={{ maxWidth: 600, width: '100%', mx: 2 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            
            <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
              Thanh toán thành công!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Cảm ơn bạn đã đặt phòng. Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Booking Details */}
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Chi tiết đặt phòng
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mã đặt phòng
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {bookingId}
                </Typography>
              </Box>

              {property && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Homestay
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {property.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.location}
                  </Typography>
                </Box>
              )}

              {bookingData && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Nhận phòng:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatDate(bookingData.checkin)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Trả phòng:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatDate(bookingData.checkout)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Số khách:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {bookingData.guests} người
                    </Typography>
                  </Box>
                </>
              )}

              {pricing && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">Tổng thanh toán:</Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {formatPrice(pricing.total)}
                  </Typography>
                </Box>
              )}

              {paymentResult && (
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label="Đã thanh toán qua MoMo" 
                    color="success" 
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  {paymentResult.transaction_id && (
                    <Typography variant="body2" color="text.secondary">
                      Mã giao dịch: {paymentResult.transaction_id}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                onClick={() => navigate('/user/bookings')}
              >
                Xem đặt phòng
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate('/')}
              >
                Về trang chủ
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default PaymentSuccess;