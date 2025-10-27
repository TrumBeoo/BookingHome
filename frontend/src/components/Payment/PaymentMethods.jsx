import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert
} from '@mui/material';
import { AccountBalanceWallet, AccountBalance, Money } from '@mui/icons-material';
import api from '../../utils/api';
import MoMoPayment from './MoMoPayment';

const PaymentMethods = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState('momo');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await api.getPaymentMethods();
      setPaymentMethods(response.methods);
    } catch (error) {
      setError('Không thể tải phương thức thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (methodId) => {
    switch (methodId) {
      case 'momo':
        return <AccountBalanceWallet sx={{ color: '#d82d8b' }} />;
      case 'bank_transfer':
        return <AccountBalance sx={{ color: '#1976d2' }} />;
      case 'cash':
        return <Money sx={{ color: '#4caf50' }} />;
      default:
        return <Money />;
    }
  };

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const renderPaymentComponent = () => {
    switch (selectedMethod) {
      case 'momo':
        return (
          <MoMoPayment
            booking={booking}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        );
      case 'bank_transfer':
        return (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chuyển khoản ngân hàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thông tin chuyển khoản sẽ được gửi qua email sau khi đặt phòng
              </Typography>
            </CardContent>
          </Card>
        );
      case 'cash':
        return (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thanh toán tiền mặt
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thanh toán bằng tiền mặt khi nhận phòng
              </Typography>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chọn phương thức thanh toán
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={selectedMethod}
          onChange={handleMethodChange}
        >
          {paymentMethods.map((method) => (
            <Card key={method.id} sx={{ mb: 1 }}>
              <CardContent sx={{ py: 2 }}>
                <FormControlLabel
                  value={method.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      {getMethodIcon(method.id)}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          {method.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  disabled={!method.enabled}
                />
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 3 }} />

      {renderPaymentComponent()}
    </Box>
  );
};

export default PaymentMethods;