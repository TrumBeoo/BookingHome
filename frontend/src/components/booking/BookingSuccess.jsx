import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingData, pricing, property, bookingId, paymentResult } = location.state || {};

  if (!bookingData) {
    return (
      <Layout>
        <div className="booking-success">
          <div className="success-container">
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>Không tìm thấy thông tin đặt phòng. Vui lòng thử lại.</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDownloadInvoice = () => {
    // Implement invoice download logic
    console.log('Download invoice for booking:', bookingId);
  };

  return (
    <Layout>
      <div className="booking-success">
        <div className="success-container">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">✅</div>
            <h1 className="success-title">Đặt phòng thành công!</h1>
            <p className="booking-id">
              Mã đặt phòng: <strong>{bookingId}</strong>
            </p>
          </div>

          {/* Booking Details */}
          <div className="info-card">
            <h2 className="card-title">Chi tiết đặt phòng</h2>
            
            <div className="booking-details-grid">
              <div className="property-image">
                <div className="image-placeholder">
                  <span>Property Image</span>
                </div>
              </div>
              
              <div className="property-info">
                <h3 className="property-name">{property.name}</h3>
                
                <div className="property-location">
                  <span className="location-icon">📍</span>
                  <span>{property.location}</span>
                </div>
                
                <div className="property-tags">
                  <span className="tag">
                    <span className="tag-icon">👥</span>
                    {bookingData.guests} khách
                  </span>
                  <span className="tag">
                    <span className="tag-icon">🌙</span>
                    {pricing.nights} đêm
                  </span>
                </div>
                
                <div className="total-price">
                  {pricing.total.toLocaleString()}đ
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="info-card">
            <h2 className="card-title">Thông tin lưu trú</h2>
            
            <div className="stay-details-grid">
              <div className="date-info">
                <div className="date-label">Ngày nhận phòng</div>
                <div className="date-value">
                  {new Date(bookingData.checkin).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="date-time">Từ 14:00</div>
              </div>
              
              <div className="date-info">
                <div className="date-label">Ngày trả phòng</div>
                <div className="date-value">
                  {new Date(bookingData.checkout).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="date-time">Trước 12:00</div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="info-card">
            <h2 className="card-title">Thông tin khách hàng</h2>
            
            <div className="guest-info-grid">
              <div className="info-item">
                <div className="info-label">Họ và tên</div>
                <div className="info-value">{bookingData.guestInfo.fullName}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Số khách</div>
                <div className="info-value">{bookingData.guests} người</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{bookingData.guestInfo.email}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Số điện thoại</div>
                <div className="info-value">{bookingData.guestInfo.phone}</div>
              </div>
              
              {bookingData.guestInfo.specialRequests && (
                <div className="info-item full-width">
                  <div className="info-label">Yêu cầu đặc biệt</div>
                  <div className="info-value">{bookingData.guestInfo.specialRequests}</div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="info-card">
            <h2 className="card-title">Chi tiết thanh toán</h2>
            
            <div className="payment-details">
              <div className="payment-item">
                <span>{property.price.toLocaleString()}đ x {pricing.nights} đêm</span>
                <span>{pricing.basePrice.toLocaleString()}đ</span>
              </div>
              
              <div className="payment-item">
                <span>Phí dịch vụ</span>
                <span>{pricing.serviceFee.toLocaleString()}đ</span>
              </div>
              
              <div className="payment-divider"></div>
              
              <div className="payment-total">
                <span>Tổng cộng</span>
                <span>{pricing.total.toLocaleString()}đ</span>
              </div>
            </div>
            
            <div className="payment-success-alert">
              <span className="alert-icon">✅</span>
              <span>Thanh toán đã được xử lý thành công qua {bookingData.paymentMethod.toUpperCase()}</span>
              {paymentResult?.transaction_id && (
                <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}>
                  Mã giao dịch: {paymentResult.transaction_id}
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="info-card">
            <h2 className="card-title">Bước tiếp theo</h2>
            
            <div className="next-steps">
              <div className="step-item">
                <span className="step-icon">📧</span>
                <span>Email xác nhận đã được gửi đến {bookingData.guestInfo.email}</span>
              </div>
              
              <div className="step-item">
                <span className="step-icon">📞</span>
                <span>Chủ nhà sẽ liên hệ với bạn qua số {bookingData.guestInfo.phone}</span>
              </div>
              
              <div className="step-item">
                <span className="step-icon">📅</span>
                <span>Nhớ check-in từ 14:00 ngày {new Date(bookingData.checkin).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn-secondary"
              onClick={handleDownloadInvoice}
            >
              <span className="btn-icon">📄</span>
              Tải hóa đơn
            </button>
            
            <button
              className="btn-primary"
              onClick={() => navigate('/')}
            >
              <span className="btn-icon">🏠</span>
              Về trang chủ
            </button>
          </div>

          {/* Contact Support */}
          <div className="support-section">
            <h3 className="support-title">Cần hỗ trợ?</h3>
            <p className="support-description">
              Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đặt phòng
            </p>
            <div className="support-buttons">
              <a href="tel:1900-1234" className="support-btn">
                <span className="btn-icon">📞</span>
                Hotline: 1900-1234
              </a>
              <a href="mailto:support@homestay.vn" className="support-btn">
                <span className="btn-icon">✉️</span>
                support@homestay.vn
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccess;