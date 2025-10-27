import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Layout from '../common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import PaymentMethods from '../Payment/PaymentMethods';
import CouponInput from './CouponInput';
import DynamicPricing from './DynamicPricing';
import ComboPackages from './ComboPackages';
import promotionService from '../../services/promotionService';

const EnhancedBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  
  // Enhanced booking data with promotions
  const [bookingData, setBookingData] = useState({
    checkin: '',
    checkout: '',
    guests: 2,
    guestInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      specialRequests: '',
    },
    paymentMethod: 'momo',
    agreeTerms: false,
  });

  // Enhanced pricing with dynamic pricing and promotions
  const [pricing, setPricing] = useState({
    nights: 0,
    basePrice: 0,
    dynamicPrice: 0,
    serviceFee: 0,
    subtotal: 0,
    discountAmount: 0,
    comboDiscount: 0,
    total: 0,
  });

  // Promotion states
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [dynamicPriceData, setDynamicPriceData] = useState(null);

  const steps = ['Chọn ngày & Khuyến mãi', 'Thông tin khách hàng', 'Thanh toán'];

  const paymentMethods = [
    { value: 'momo', label: 'MoMo', icon: '💳' },
    { value: 'vnpay', label: 'VNPay', icon: '🏦' },
    { value: 'paypal', label: 'PayPal', icon: '💰' },
    { value: 'stripe', label: 'Stripe', icon: '💳' },
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    calculateEnhancedPricing();
  }, [bookingData.checkin, bookingData.checkout, property, dynamicPriceData, appliedCoupon, selectedCombo]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.getHomestay(id);
      const homestayData = response.homestay;
      
      const transformedProperty = {
        id: homestayData.id,
        name: homestayData.name,
        location: homestayData.address,
        price: homestayData.price_per_night,
        rating: homestayData.avg_rating || 0,
        reviews: homestayData.review_count || 0,
        image: homestayData.images?.[0]?.image_path ? `http://localhost:8000${homestayData.images[0].image_path}` : null,
        host: homestayData.host?.name || 'Host',
        maxGuests: homestayData.max_guests || 2,
      };
      
      setProperty(transformedProperty);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEnhancedPricing = () => {
    if (!bookingData.checkin || !bookingData.checkout || !property) return;
    
    const start = new Date(bookingData.checkin);
    const end = new Date(bookingData.checkout);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return;
    
    // Use dynamic pricing if available, otherwise use base price
    const effectivePrice = dynamicPriceData ? dynamicPriceData.totalPrice : (nights * property.price);
    const serviceFee = Math.round(effectivePrice * 0.1);
    let subtotal = effectivePrice + serviceFee;
    
    // Apply coupon discount
    let discountAmount = 0;
    if (appliedCoupon) {
      discountAmount = appliedCoupon.discount_amount;
    }
    
    // Apply combo discount
    let comboDiscount = 0;
    if (selectedCombo) {
      // Calculate combo discount based on original price vs combo price
      const originalComboPrice = selectedCombo.original_price;
      const comboPrice = selectedCombo.combo_price;
      comboDiscount = originalComboPrice - comboPrice;
    }
    
    const total = Math.max(0, subtotal - discountAmount - comboDiscount);
    
    setPricing({
      nights,
      basePrice: nights * property.price,
      dynamicPrice: effectivePrice,
      serviceFee,
      subtotal,
      discountAmount,
      comboDiscount,
      total
    });
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setBookingData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && (!bookingData.checkin || !bookingData.checkout || pricing.nights <= 0)) {
      alert('Vui lòng chọn ngày nhận và trả phòng hợp lệ');
      return;
    }
    
    if (activeStep === 1) {
      const { fullName, email, phone } = bookingData.guestInfo;
      if (!fullName || !email || !phone) {
        alert('Vui lòng điền đầy đủ thông tin khách hàng');
        return;
      }
    }
    
    if (activeStep === 2) {
      if (!bookingData.agreeTerms) {
        alert('Vui lòng đồng ý với điều khoản và điều kiện');
        return;
      }
      setConfirmDialogOpen(true);
      return;
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
  };

  const handleComboSelect = (combo) => {
    setSelectedCombo(combo);
  };

  const handleDynamicPriceCalculated = (priceData) => {
    setDynamicPriceData(priceData);
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingPayload = {
        homestay_id: parseInt(id),
        check_in: bookingData.checkin,
        check_out: bookingData.checkout,
        guests: bookingData.guests,
        total_price: pricing.total,
        guest_info: bookingData.guestInfo,
        payment_method: bookingData.paymentMethod,
        special_requests: bookingData.guestInfo.specialRequests,
        // Add promotion data
        applied_coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discount_amount: appliedCoupon.discount_amount
        } : null,
        selected_combo: selectedCombo ? {
          id: selectedCombo.id,
          name: selectedCombo.name,
          discount_amount: pricing.comboDiscount
        } : null
      };
      
      const response = await api.createBooking(bookingPayload);
      
      setCurrentBooking({
        ...response.booking,
        total_price: pricing.total
      });
      
      setConfirmDialogOpen(false);
      
      if (bookingData.paymentMethod === 'momo') {
        setShowPayment(true);
      } else {
        navigate('/booking-success', { 
          state: { 
            bookingData, 
            pricing, 
            property,
            bookingId: response.booking?.id || 'BK' + Date.now(),
            appliedCoupon,
            selectedCombo
          } 
        });
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    navigate('/booking-success', { 
      state: { 
        bookingData, 
        pricing, 
        property,
        bookingId: currentBooking?.id || 'BK' + Date.now(),
        paymentResult,
        appliedCoupon,
        selectedCombo
      } 
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    alert('Thanh toán thất bại. Vui lòng thử lại.');
    setShowPayment(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* Date Selection */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Chọn ngày và số khách
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày nhận phòng"
                    value={bookingData.checkin}
                    onChange={(e) => handleInputChange(null, 'checkin', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày trả phòng"
                    value={bookingData.checkout}
                    onChange={(e) => handleInputChange(null, 'checkout', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: bookingData.checkin }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Số khách"
                    value={bookingData.guests}
                    onChange={(e) => handleInputChange(null, 'guests', parseInt(e.target.value))}
                  >
                    {Array.from({ length: property?.maxGuests || 8 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} khách
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            {/* Dynamic Pricing */}
            {bookingData.checkin && bookingData.checkout && property && (
              <DynamicPricing
                homestayId={property.id}
                checkIn={bookingData.checkin}
                checkOut={bookingData.checkout}
                basePrice={property.price}
                onPriceCalculated={handleDynamicPriceCalculated}
              />
            )}

            {/* Combo Packages */}
            {pricing.nights > 0 && (
              <ComboPackages
                nights={pricing.nights}
                includesBreakfast={false}
                onComboSelect={handleComboSelect}
                selectedCombo={selectedCombo}
              />
            )}

            {/* Coupon Input */}
            {pricing.nights > 0 && (
              <CouponInput
                onCouponApply={handleCouponApply}
                onCouponRemove={handleCouponRemove}
                totalAmount={pricing.subtotal}
                homestayId={property?.id}
                userId={user?.id}
                appliedCoupon={appliedCoupon}
              />
            )}
          </Box>
        );
        
      case 1:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Thông tin khách hàng
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={bookingData.guestInfo.fullName}
                  onChange={(e) => handleInputChange('guestInfo', 'fullName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={bookingData.guestInfo.email}
                  onChange={(e) => handleInputChange('guestInfo', 'email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={bookingData.guestInfo.phone}
                  onChange={(e) => handleInputChange('guestInfo', 'phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Yêu cầu đặc biệt"
                  value={bookingData.guestInfo.specialRequests}
                  onChange={(e) => handleInputChange('guestInfo', 'specialRequests', e.target.value)}
                  placeholder="Ví dụ: Phòng tầng cao, giường đôi, ..."
                />
              </Grid>
            </Grid>
          </Paper>
        );
        
      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Phương thức thanh toán
            </Typography>
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} sm={6} md={3} key={method.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: bookingData.paymentMethod === method.value ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => handleInputChange(null, 'paymentMethod', method.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {method.icon}
                      </Typography>
                      <Typography variant="body2">
                        {method.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookingData.agreeTerms}
                    onChange={(e) => handleInputChange(null, 'agreeTerms', e.target.checked)}
                  />
                }
                label="Tôi đồng ý với điều khoản và điều kiện"
              />
            </Box>
          </Paper>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  if (showPayment && currentBooking) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <PaymentMethods
            booking={currentBooking}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                >
                  Quay lại
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
                >
                  {activeStep === steps.length - 1 ? 'Xác nhận đặt phòng' : 'Tiếp tục'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Property Info */}
            {property && (
              <Card sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image || '/placeholder-image.jpg'}
                  alt={property.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {property.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ fontSize: 16, mr: 0.5, color: '#ffc107' }} />
                    <Typography variant="body2">
                      {property.rating} ({property.reviews} đánh giá)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Tối đa {property.maxGuests} khách
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Pricing Summary */}
            {pricing.nights > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tóm tắt đặt phòng
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {promotionService.formatPrice(property?.price)} x {pricing.nights} đêm
                      </Typography>
                      <Typography variant="body2">
                        {promotionService.formatPrice(pricing.basePrice)}
                      </Typography>
                    </Box>
                    
                    {dynamicPriceData && pricing.dynamicPrice !== pricing.basePrice && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="primary">
                          Điều chỉnh giá động
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {pricing.dynamicPrice > pricing.basePrice ? '+' : ''}
                          {promotionService.formatPrice(pricing.dynamicPrice - pricing.basePrice)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Phí dịch vụ</Typography>
                      <Typography variant="body2">
                        {promotionService.formatPrice(pricing.serviceFee)}
                      </Typography>
                    </Box>
                    
                    {appliedCoupon && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Mã giảm giá ({appliedCoupon.code})
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -{promotionService.formatPrice(pricing.discountAmount)}
                        </Typography>
                      </Box>
                    )}
                    
                    {selectedCombo && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Combo ({selectedCombo.name})
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -{promotionService.formatPrice(pricing.comboDiscount)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Tổng cộng</Typography>
                    <Typography variant="h6" color="primary">
                      {promotionService.formatPrice(pricing.total)}
                    </Typography>
                  </Box>
                  
                  {(appliedCoupon || selectedCombo) && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Bạn đã tiết kiệm {promotionService.formatPrice(pricing.discountAmount + pricing.comboDiscount)}!
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Xác nhận đặt phòng</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn đặt phòng với thông tin sau?
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2"><strong>Homestay:</strong> {property?.name}</Typography>
              <Typography variant="body2"><strong>Ngày:</strong> {bookingData.checkin} đến {bookingData.checkout}</Typography>
              <Typography variant="body2"><strong>Số khách:</strong> {bookingData.guests}</Typography>
              <Typography variant="body2"><strong>Tổng tiền:</strong> {promotionService.formatPrice(pricing.total)}</Typography>
              {appliedCoupon && (
                <Typography variant="body2" color="success.main">
                  <strong>Mã giảm giá:</strong> {appliedCoupon.code} (-{promotionService.formatPrice(pricing.discountAmount)})
                </Typography>
              )}
              {selectedCombo && (
                <Typography variant="body2" color="success.main">
                  <strong>Combo:</strong> {selectedCombo.name} (-{promotionService.formatPrice(pricing.comboDiscount)})
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleConfirmBooking}>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default EnhancedBookingPage;