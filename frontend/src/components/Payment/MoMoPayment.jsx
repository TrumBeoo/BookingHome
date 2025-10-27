import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { QrCode, AccountBalanceWallet, OpenInNew } from '@mui/icons-material';
import api from '../../utils/api';

const MoMoPayment = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [error, setError] = useState('');

  const handleMoMoPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.createMoMoPayment(booking.id);
      
      if (response.success) {
        setPaymentData(response);
        
        // Mở URL thanh toán trong tab mới
        if (response.payment_url) {
          window.open(response.payment_url, '_blank');
        }
        
        // Hiển thị QR code nếu có
        if (response.qr_code_url) {
          setShowQRDialog(true);
        }
        
        // Bắt đầu polling để kiểm tra trạng thái thanh toán
        startPaymentStatusPolling(response.payment_id);
      }
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi tạo thanh toán');
      onPaymentError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusPolling = (paymentId) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await api.checkMoMoPaymentStatus(paymentId);
        
        if (status.status === 'paid') {
          clearInterval(pollInterval);
          setShowQRDialog(false);
          onPaymentSuccess?.(status);
        } else if (status.status === 'failed') {
          clearInterval(pollInterval);
          setError('Thanh toán thất bại');
          onPaymentError?.(new Error('Thanh toán thất bại'));
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalanceWallet sx={{ mr: 1, color: '#d82d8b' }} />
            <Typography variant="h6" component="div">
              Thanh toán MoMo
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Thanh toán nhanh chóng và bảo mật qua ví điện tử MoMo
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Tổng tiền:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatPrice(booking.total_price)}
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            variant="contained"
            fullWidth
            onClick={handleMoMoPayment}
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: '#d82d8b',
              '&:hover': {
                backgroundColor: '#b8246f'
              }
            }}
            startIcon={loading ? <CircularProgress size={20} /> : <AccountBalanceWallet />}
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán với MoMo'}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog 
        open={showQRDialog} 
        onClose={() => setShowQRDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <AccountBalanceWallet sx={{ mr: 1, color: '#d82d8b' }} />
          Thanh toán MoMo
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quét mã QR để thanh toán
            </Typography>
            
            {paymentData?.qr_code_url && (
              <Box sx={{ my: 3 }}>
                <img 
                  src={paymentData.qr_code_url} 
                  alt="MoMo QR Code"
                  style={{ maxWidth: '250px', width: '100%' }}
                />
              </Box>
            )}
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Số tiền: {formatPrice(booking.total_price)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Mở ứng dụng MoMo và quét mã QR để thanh toán
            </Typography>
            
            {paymentData?.deep_link && (
              <Button
                variant="outlined"
                onClick={() => window.open(paymentData.deep_link, '_blank')}
                sx={{ mt: 2 }}
                startIcon={<OpenInNew />}
              >
                Mở ứng dụng MoMo
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRDialog(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MoMoPayment;