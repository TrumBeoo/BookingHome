import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import PaymentMethods from '../Payment/PaymentMethods';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  
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

  const [pricing, setPricing] = useState({
    nights: 0,
    basePrice: 0,
    serviceFee: 0,
    total: 0,
  });



  const steps = ['Thông tin đặt phòng', 'Thông tin khách hàng', 'Thanh toán'];

  const paymentMethods = [
    { value: 'momo', label: 'MoMo', icon: '💳' },
    { value: 'vnpay', label: 'VNPay', icon: '🏦' },
    { value: 'paypal', label: 'PayPal', icon: '💰' },
    { value: 'stripe', label: 'Stripe', icon: '💳' },
  ];

  const [hoveredPayment, setHoveredPayment] = useState(null);

  useEffect(() => {
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

    fetchProperty();
  }, [id]);

  useEffect(() => {
    calculatePricing();
  }, [bookingData.checkin, bookingData.checkout, property]);

  const calculatePricing = () => {
    if (!bookingData.checkin || !bookingData.checkout || !property) return;
    
    const start = new Date(bookingData.checkin);
    const end = new Date(bookingData.checkout);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return;
    
    const basePrice = nights * property.price;
    const serviceFee = Math.round(basePrice * 0.1);
    const total = basePrice + serviceFee;
    
    setPricing({ nights, basePrice, serviceFee, total });
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
        special_requests: bookingData.guestInfo.specialRequests
      };
      
      const response = await api.createBooking(bookingPayload);
      
      setCurrentBooking({
        ...response.booking,
        total_price: pricing.total
      });
      
      setConfirmDialogOpen(false);
      
      // Nếu chọn thanh toán MOMO, hiển thị component thanh toán
      if (bookingData.paymentMethod === 'momo') {
        setShowPayment(true);
      } else {
        // Các phương thức thanh toán khác chuyển thẳng đến success
        navigate('/booking-success', { 
          state: { 
            bookingData, 
            pricing, 
            property,
            bookingId: response.booking?.id || 'BK' + Date.now(),
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
        paymentResult
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
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#212121',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Chọn ngày và số khách
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Ngày nhận phòng
                </label>
                <input
                  type="date"
                  value={bookingData.checkin}
                  onChange={(e) => handleInputChange(null, 'checkin', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Ngày trả phòng
                </label>
                <input
                  type="date"
                  value={bookingData.checkout}
                  onChange={(e) => handleInputChange(null, 'checkout', e.target.value)}
                  min={bookingData.checkin}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Số khách
                </label>
                <select
                  value={bookingData.guests}
                  onChange={(e) => handleInputChange(null, 'guests', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    backgroundColor: 'white',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                >
                  {Array.from({ length: property?.maxGuests || 8 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} khách
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {pricing.nights > 0 && (
              <div style={{ 
                marginTop: '24px', 
                padding: '24px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '12px',
                border: '1px solid #e0e0e0'
              }}>
                <h4 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#212121',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Chi tiết giá
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', color: '#212121' }}>
                    {property?.price.toLocaleString()}đ x {pricing.nights} đêm
                  </span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', color: '#212121' }}>
                    {pricing.basePrice.toLocaleString()}đ
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', color: '#212121' }}>Phí dịch vụ</span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', color: '#212121' }}>
                    {pricing.serviceFee.toLocaleString()}đ
                  </span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '16px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600',
                    fontFamily: 'Roboto, sans-serif',
                    color: '#212121'
                  }}>
                    Tổng cộng
                  </span>
                  <span style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600',
                    color: '#1976d2',
                    fontFamily: 'Roboto, sans-serif'
                  }}>
                    {pricing.total.toLocaleString()}đ
                  </span>
                </div>
              </div>
            )}
          </div>
        );
        
      case 1:
        return (
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#212121',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Thông tin khách hàng
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={bookingData.guestInfo.fullName}
                  onChange={(e) => handleInputChange('guestInfo', 'fullName', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={bookingData.guestInfo.email}
                  onChange={(e) => handleInputChange('guestInfo', 'email', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={bookingData.guestInfo.phone}
                  onChange={(e) => handleInputChange('guestInfo', 'phone', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: '#757575',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  Yêu cầu đặc biệt (tùy chọn)
                </label>
                <textarea
                  value={bookingData.guestInfo.specialRequests}
                  onChange={(e) => handleInputChange('guestInfo', 'specialRequests', e.target.value)}
                  placeholder="Ví dụ: Cần giường phụ, có trẻ em, dị ứng thực phẩm..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#212121',
              fontFamily: 'Roboto, sans-serif'
            }}>
              Phương thức thanh toán
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  onClick={() => handleInputChange(null, 'paymentMethod', method.value)}
                  onMouseEnter={() => setHoveredPayment(method.value)}
                  onMouseLeave={() => setHoveredPayment(null)}
                  style={{
                    padding: '16px',
                    border: bookingData.paymentMethod === method.value ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: bookingData.paymentMethod === method.value ? '#f3f7ff' : 'white',
                    transition: 'all 0.3s ease',
                    transform: hoveredPayment === method.value ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hoveredPayment === method.value ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{method.icon}</span>
                  <span style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600',
                    fontFamily: 'Roboto, sans-serif',
                    color: '#212121'
                  }}>
                    {method.label}
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                color: '#212121'
              }}>
                <input
                  type="checkbox"
                  checked={bookingData.agreeTerms}
                  onChange={(e) => handleInputChange(null, 'agreeTerms', e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#1976d2'
                  }}
                />
                Tôi đồng ý với điều khoản và điều kiện
              </label>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="booking-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="booking-page">
        <div className="booking-container">
          <h1 className="booking-title">Đặt phòng</h1>
          
          <div className="booking-layout">
            <div className="booking-main">
              {/* Stepper */}
              <div className="stepper-container">
                <div className="stepper">
                  {steps.map((label, index) => (
                    <div key={label} className={`step ${index <= activeStep ? 'active' : ''}`}>
                      <div className="step-number">
                        {index < activeStep ? '✓' : index + 1}
                      </div>
                      <div className="step-label">{label}</div>
                      {index < steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Step Content */}
              <div className="step-content">
                {renderStepContent(activeStep)}
                
                <div className="step-actions">
                  <button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    className="btn-secondary"
                    style={{ opacity: activeStep === 0 ? 0.5 : 1 }}
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                  >
                    {activeStep === steps.length - 1 ? 'Xác nhận đặt phòng' : 'Tiếp tục'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="booking-sidebar">
              <div className="property-card">
                <div className="property-image">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: property.image ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      height: '200px',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  >
                    Hình ảnh homestay
                  </div>
                </div>
                
                <h3 className="property-name">{property.name}</h3>
                
                <div className="property-location">
                  <span className="location-icon">📍</span>
                  <span>{property.location}</span>
                </div>
                
                <div className="property-rating">
                  <span className="star-icon">⭐</span>
                  <span>{property.rating} ({property.reviews} đánh giá)</span>
                </div>
                
                <div className="divider"></div>
                
                {bookingData.checkin && bookingData.checkout && (
                  <div className="booking-details">
                    <h4>Chi tiết đặt phòng</h4>
                    <div className="detail-item">
                      <span>Nhận phòng:</span>
                      <span>{new Date(bookingData.checkin).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <span>Trả phòng:</span>
                      <span>{new Date(bookingData.checkout).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <span>Số khách:</span>
                      <span>{bookingData.guests}</span>
                    </div>
                    
                    {pricing.nights > 0 && (
                      <div className="total-price">
                        <div className="price-amount">Tổng: {pricing.total.toLocaleString()}đ</div>
                        <div className="price-nights">({pricing.nights} đêm)</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Confirmation Dialog */}
        {confirmDialogOpen && (
          <div className="dialog-overlay" onClick={() => setConfirmDialogOpen(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Xác nhận đặt phòng</h3>
                <button 
                  className="dialog-close"
                  onClick={() => setConfirmDialogOpen(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="dialog-body">
                <div className="alert-info">
                  <span className="alert-icon">ℹ️</span>
                  <span>Vui lòng kiểm tra lại thông tin trước khi xác nhận</span>
                </div>
                
                <h4 className="property-name-dialog">{property.name}</h4>
                
                <div className="confirmation-details">
                  <div className="detail-section">
                    <div><strong>Khách hàng:</strong> {bookingData.guestInfo.fullName}</div>
                    <div><strong>Email:</strong> {bookingData.guestInfo.email}</div>
                    <div><strong>Điện thoại:</strong> {bookingData.guestInfo.phone}</div>
                  </div>
                  
                  <div className="detail-section">
                    <div><strong>Nhận phòng:</strong> {new Date(bookingData.checkin).toLocaleDateString('vi-VN')}</div>
                    <div><strong>Trả phòng:</strong> {new Date(bookingData.checkout).toLocaleDateString('vi-VN')}</div>
                    <div><strong>Số khách:</strong> {bookingData.guests}</div>
                  </div>
                  
                  <div className="total-payment">
                    <strong>Tổng thanh toán: {pricing.total.toLocaleString()}đ</strong>
                  </div>
                </div>
              </div>
              
              <div className="dialog-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setConfirmDialogOpen(false)}
                >
                  Hủy
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleConfirmBooking}
                >
                  Xác nhận và thanh toán
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Dialog */}
        {showPayment && currentBooking && (
          <div className="dialog-overlay">
            <div className="dialog-content payment-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <h3>Thanh toán đặt phòng</h3>
                <button 
                  className="dialog-close"
                  onClick={() => setShowPayment(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="dialog-body">
                <PaymentMethods
                  booking={currentBooking}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;