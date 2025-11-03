import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Chip, 
  Typography,
  InputAdornment,
  CircularProgress,
  Collapse
} from '@mui/material';
import { 
  LocalOffer as CouponIcon, 
  Check as CheckIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import promotionService from '../../services/promotionService';

const CouponInput = ({ 
  onCouponApply, 
  onCouponRemove, 
  totalAmount, 
  homestayId, 
  userId,
  appliedCoupon = null 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const couponData = {
        code: couponCode.toUpperCase(),
        total_amount: totalAmount,
        homestay_id: homestayId,
        user_id: userId
      };

      const result = await promotionService.validateCoupon(couponData);
      
      if (result.valid) {
        setSuccess(`Áp dụng thành công! ${result.message}`);
        setCouponCode('');
        onCouponApply && onCouponApply({
          ...result,
          code: couponData.code
        });
      }
    } catch (error) {
      setError(error.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setError('');
    setSuccess('');
    onCouponRemove && onCouponRemove();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CouponIcon color="primary" />
        Mã giảm giá
      </Typography>

      {appliedCoupon ? (
        <Box sx={{ 
          p: 2, 
          border: '2px solid #4caf50', 
          borderRadius: 2, 
          backgroundColor: '#f1f8e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ color: '#4caf50' }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                Mã "{appliedCoupon.code}" đã được áp dụng
              </Typography>
              <Typography variant="body2" sx={{ color: '#388e3c' }}>
                Giảm {promotionService.formatPrice(appliedCoupon.discount_amount)}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleRemoveCoupon}
          >
            Hủy
          </Button>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CouponIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              sx={{ 
                minWidth: 100,
                height: 56 // Match TextField height
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Áp dụng'}
            </Button>
          </Box>

          <Collapse in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>

          <Collapse in={!!success}>
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          </Collapse>
        </Box>
      )}

      {/* Hiển thị gợi ý mã giảm giá */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Mã giảm giá có sẵn:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['WELCOME10', 'SUMMER20', 'WEEKEND15', 'AUTUMN30', 'COMBO3N2D'].map((code) => (
            <Chip
              key={code}
              label={code}
              variant="outlined"
              size="small"
              onClick={() => setCouponCode(code)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            />
          ))}
        </Box>
        
        {/* Thông báo khuyến mãi đặc biệt */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: '#fff3e0', 
          borderRadius: 2,
          border: '1px solid #ffb74d'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
            🎉 Ưu đãi đặc biệt!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • WELCOME10: Giảm 10% (đơn từ 500k, tối đa 200k)<br/>
            • SUMMER20: Giảm 20% (đơn từ 1tr, tối đa 500k)<br/>
            • WEEKEND15: Giảm 15% (đơn từ 500k, tối đa 300k)<br/>
            • AUTUMN30: Giảm 30% (đơn từ 2tr, tối đa 1tr)<br/>
            • COMBO3N2D: Giảm 500k (đơn từ 1.5tr)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CouponInput;