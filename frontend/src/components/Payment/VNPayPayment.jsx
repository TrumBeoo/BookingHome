import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CreditCard,
  Security,
  Speed,
  CheckCircle,
  Launch,
} from '@mui/icons-material';
import api from '../../utils/api';

const VNPayPayment = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const handleVNPayPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.createVNPayPayment(booking.id);
      
      if (response.success) {
        setPaymentUrl(response.payment_url);
        // Mở cửa sổ thanh toán VNPay
        window.open(response.payment_url, '_blank', 'width=800,height=600');
        
        // Bắt đầu polling để kiểm tra trạng thái thanh toán
        startPaymentStatusPolling(response.payment_id);
      } else {
        setError('Không thể tạo thanh toán VNPay');
      }
    } catch (error) {
      console.error('VNPay payment error:', error);
      setError(error.message || 'Có lỗi xảy ra khi tạo thanh toán');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusPolling = (paymentId) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await api.checkVNPayPaymentStatus(paymentId);
        
        if (statusResponse.status === 'paid') {
          clearInterval(pollInterval);
          onPaymentSuccess({
            paymentId: paymentId,
            transactionId: statusResponse.transaction_id,
            amount: statusResponse.amount,
            method: 'vnpay'
          });
        } else if (statusResponse.status === 'failed') {
          clearInterval(pollInterval);
          setError('Thanh toán thất bại');
          onPaymentError(new Error('Payment failed'));
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 3000); // Kiểm tra mỗi 3 giây

    // Dừng polling sau 10 phút
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 600000);
  };

  const vnpayFeatures = [
    {
      icon: <Security color="primary" />,
      title: 'Bảo mật cao',
      description: 'Công nghệ mã hóa SSL 256-bit'
    },
    {
      icon: <Speed color="primary" />,
      title: 'Thanh toán nhanh',
      description: 'Xử lý giao dịch trong vài giây'
    },
    {
      icon: <CreditCard color="primary" />,
      title: 'Đa dạng thẻ',
      description: 'Hỗ trợ tất cả thẻ nội địa và quốc tế'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CreditCard sx={{ color: '#0066cc', mr: 1 }} />
          <Typography variant="h6">
            Thanh toán VNPay
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Thanh toán an toàn qua cổng VNPay với thẻ ATM, Internet Banking, hoặc ví điện tử
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin thanh toán:
          </Typography>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Mã đặt phòng:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {booking.booking_code || booking.id}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Số tiền:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {Number(booking.total_price).toLocaleString()}đ
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Ưu điểm VNPay:
        </Typography>
        
        <List dense>
          {vnpayFeatures.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={feature.title}
                secondary={feature.description}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleVNPayPayment}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Launch />}
            sx={{
              bgcolor: '#0066cc',
              '&:hover': { bgcolor: '#0052a3' },
              py: 1.5
            }}
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán với VNPay'}
          </Button>
        </Box>

        {paymentUrl && (
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => window.open(paymentUrl, '_blank')}
              >
                Mở lại
              </Button>
            }
          >
            Cửa sổ thanh toán đã được mở. Nếu không thấy, vui lòng kiểm tra popup blocker.
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Bằng việc tiếp tục, bạn đồng ý với điều khoản sử dụng của VNPay
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VNPayPayment;