import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import MiniAvailabilityCalendar from '../booking/MiniAvailabilityCalendar';
import DiscountBadge from '../banner/DiscountBadge';
import PromoBanner from '../banner/PromoBanner';
import { openDirections } from '../../utils/directions';
import './PropertyDetail.css';

const getAmenityIcon = (amenityName) => {
  const iconMap = {
    'wifi': '📶',
    'parking': '🚗',
    'restaurant': '🍽️',
    'pool': '🏊',
    'gym': '💪',
    'spa': '🧖',
    'kitchen': '🍳',
    'laundry': '🧺',
    'air_conditioning': '❄️',
    'tv': '📺',
    'balcony': '🏡',
    'garden': '🌿'
  };
  
  const key = amenityName.toLowerCase().replace(/\s+/g, '_');
  return iconMap[key] || '✨';
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);





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
          fullAddress: homestayData.address,
          price: homestayData.price_per_night,
          rating: homestayData.avg_rating || 0,
          reviewCount: homestayData.review_count || 0,
          images: homestayData.images?.map(img => `http://localhost:8000${img.image_path}`) || [],
          amenities: homestayData.amenities?.map(amenity => ({
            id: amenity.id,
            label: amenity.name,
            icon: getAmenityIcon(amenity.name)
          })) || [],
          description: homestayData.description || 'Homestay tuyệt vời',
          maxGuests: homestayData.max_guests || 2,
          bedrooms: homestayData.bedrooms || 1,
          bathrooms: homestayData.bathrooms || 1,
          host: {
            name: homestayData.host?.name || 'Host',
            avatar: homestayData.host?.name?.charAt(0) || 'H',
            phone: homestayData.host?.phone || '',
            email: homestayData.host?.email || '',
            rating: homestayData.host?.rating || 0,
            reviews: homestayData.host?.review_count || 0,
            joinedDate: homestayData.host?.created_at ? 
              `Tham gia từ ${new Date(homestayData.host.created_at).getFullYear()}` : 
              'Tham gia từ 2020',
            description: homestayData.host?.bio || 'Chủ nhà thân thiện và nhiệt tình.',
          },
          houseRules: homestayData.house_rules || [
            `Check-in: ${homestayData.check_in_time || '14:00'} - 22:00`,
            `Check-out: ${homestayData.check_out_time || '12:00'}`,
            'Không hút thuốc trong nhà',
            'Không tổ chức tiệc tùng',
            'Giữ gìn vệ sinh chung',
          ],
          nearbyPlaces: homestayData.nearby_places || [
            { name: 'Trung tâm thành phố', distance: '2 km' },
            { name: 'Bến xe buýt', distance: '500m' },
            { name: 'Siêu thị', distance: '1 km' },
          ],
          reviews: homestayData.reviews?.map(review => ({
            id: review.id,
            user: review.user_name,
            rating: review.rating,
            date: review.created_at?.split('T')[0] || '2024-01-01',
            comment: review.comment,
            avatar: review.user_name?.charAt(0) || 'U',
          })) || [],
        };
        
        setProperty(transformedProperty);
        setError(null);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Không thể tải thông tin homestay. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    navigate(`/property/${id}/booking`);
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setImageDialogOpen(true);
  };



  const LoginDialog = () => (
    loginDialogOpen && (
      <div className="dialog-overlay" onClick={() => setLoginDialogOpen(false)}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-header">
            <h3>Đăng nhập để tiếp tục</h3>
            <button 
              className="dialog-close"
              onClick={() => setLoginDialogOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="dialog-body">
            <p>Bạn cần đăng nhập để thêm vào yêu thích hoặc đặt phòng.</p>
          </div>
          
          <div className="dialog-actions">
            <button 
              className="btn-secondary"
              onClick={() => setLoginDialogOpen(false)}
            >
              Hủy
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                setLoginDialogOpen(false);
                navigate('/login');
              }}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ImageDialog = () => (
    imageDialogOpen && (
      <div className="image-dialog-overlay" onClick={() => setImageDialogOpen(false)}>
        <div className="image-dialog-content" onClick={(e) => e.stopPropagation()}>
          <button 
            className="image-dialog-close"
            onClick={() => setImageDialogOpen(false)}
          >
            ×
          </button>
          
          <div className="image-dialog-main">
            <button 
              className="image-nav-btn prev"
              onClick={() => setCurrentImageIndex(
                currentImageIndex === 0 ? property.images.length - 1 : currentImageIndex - 1
              )}
            >
              ‹
            </button>
            
            {property.images[currentImageIndex] ? (
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.name} - Ảnh ${currentImageIndex + 1}`}
                className="image-display"
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="image-display"
              style={{
                backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: property.images[currentImageIndex] ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                minHeight: '400px'
              }}
            >
              <span className="image-placeholder">Ảnh {currentImageIndex + 1}</span>
            </div>
            
            <button 
              className="image-nav-btn next"
              onClick={() => setCurrentImageIndex(
                currentImageIndex === property.images.length - 1 ? 0 : currentImageIndex + 1
              )}
            >
              ›
            </button>
          </div>
          
          <div className="image-counter">
            {currentImageIndex + 1} / {property?.images.length}
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <Layout>
        <div className="property-detail">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="property-detail">
          <div className="error-container">
            <h2>Lỗi</h2>
            <p>{error}</p>
            <button 
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="property-detail">
          <div className="error-container">
            <h2>Không tìm thấy homestay</h2>
            <p>Homestay bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="property-detail">
        <div className="property-container">
          <PromoBanner position="detail_top" />
          {/* Header */}
          <div className="property-header">
            <div className="property-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <h1 className="property-title">{property.name}</h1>
                <DiscountBadge discount={property.discount_percent} position="inline" />
              </div>
              <div className="property-meta">
                <div className="rating-info">
                  <span className="star-icon">⭐</span>
                  <span className="rating-value">{property.rating}</span>
                  <span className="review-count">({property.reviewCount} đánh giá)</span>
                </div>
                <span className="separator">•</span>
                <div className="location-info">
                  <span className="location-icon">📍</span>
                  <span>{property.location}</span>
                </div>
              </div>
            </div>
            
            <div className="property-actions">
              <button 
                className="action-btn"
                onClick={() => navigator.share?.({ url: window.location.href })}
                title="Chia sẻ"
              >
                🔗
              </button>
              <button 
                className="action-btn favorite-btn"
                onClick={handleFavoriteClick}
                title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="property-images">
            <div className="images-grid">
              {(property.images.length > 0 ? property.images : [null, null, null, null]).slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`image-item ${index === 0 ? 'main-image' : 'sub-image'}`}
                  onClick={() => property.images.length > 0 && handleImageClick(index)}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`${property.name} - Ảnh ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
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
                    className="image-placeholder"
                    style={{
                      display: image ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px'
                    }}
                  >
                    <span>Ảnh {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="property-layout">
            {/* Main Content */}
            <div className="property-main">
              {/* Property Info */}
              <div className="info-card">
                <h2>Thông tin cơ bản</h2>
                <div className="basic-info">
                  <span>👥 {property.maxGuests} khách</span>
                  <span>🛏️ {property.bedrooms} phòng ngủ</span>
                  <span>🚿 {property.bathrooms} phòng tắm</span>
                </div>
                
                <div className="divider"></div>
                
                <h3>Mô tả</h3>
                <p className="description">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="info-card">
                <h2>Tiện nghi</h2>
                <div className="amenities-grid">
                  {property.amenities.length > 0 ? (
                    property.amenities.map((amenity) => (
                      <div key={amenity.id} className="amenity-item">
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span className="amenity-label">{amenity.label}</span>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có thông tin tiện nghi.</p>
                  )}
                </div>
              </div>

              {/* Host Info */}
              <div className="info-card">
                <h2>Thông tin chủ nhà</h2>
                <div className="host-info">
                  <div className="host-avatar">
                    {property.host.avatar}
                  </div>
                  <div className="host-details">
                    <h3 className="host-name">{property.host.name}</h3>
                    <div className="host-meta">
                      <div className="host-rating">
                        <span className="star-icon">⭐</span>
                        <span>{property.host.rating} ({property.host.reviews} đánh giá)</span>
                      </div>
                      <span className="host-joined">{property.host.joinedDate}</span>
                    </div>
                    <p className="host-description">{property.host.description}</p>
                    <div className="host-actions">
                      <a href={`tel:${property.host.phone}`} className="btn-secondary">
                        📞 Gọi điện
                      </a>
                      <a href={`mailto:${property.host.email}`} className="btn-secondary">
                        ✉️ Nhắn tin
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Calendar */}
              <div className="info-card">
                <h2>Lịch trống</h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <MiniAvailabilityCalendar
                    homestayId={property.id}
                    roomId={null}
                    onDateSelect={(date) => console.log('Selected date:', date)}
                  />
                </div>
              </div>

              {/* Reviews */}
              <div className="info-card">
                <h2>Đánh giá từ khách hàng</h2>
                <div className="reviews-list">
                  {property.reviews.length > 0 ? (
                    property.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-avatar">
                            {review.avatar}
                          </div>
                          <div className="reviewer-info">
                            <h4 className="reviewer-name">{review.user}</h4>
                            <div className="review-meta">
                              <div className="review-rating">
                                {'⭐'.repeat(review.rating)}
                              </div>
                              <span className="review-date">
                                {new Date(review.date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">Chưa có đánh giá nào cho homestay này.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="booking-sidebar">
              <div className="booking-card">
                <div className="booking-header">
                  <div className="price-info">
                    <span className="price">{property.price.toLocaleString()}đ</span>
                    <span className="price-unit">/đêm</span>
                  </div>
                  <div className="rating-badge">
                    <span className="star-icon">⭐</span>
                    <span>{property.rating}</span>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="auth-notice">
                    <p>Đăng nhập để xem giá tốt nhất và đặt phòng</p>
                  </div>
                )}

                <button
                  className="btn-primary booking-btn"
                  onClick={handleBookNow}
                >
                  {isAuthenticated ? 'Đặt phòng ngay' : 'Đăng nhập để đặt phòng'}
                </button>
                
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/property/${id}/booking-calendar`)}
                  style={{ marginTop: '8px', width: '100%' }}
                >
                  📅 Đặt phòng với lịch
                </button>
                
                <button
                  className="btn-secondary"
                  onClick={() => openDirections(id)}
                  style={{ marginTop: '8px', width: '100%', backgroundColor: '#4285f4', color: 'white' }}
                >
                  📍 Chỉ đường
                </button>

                <p className="no-charge-notice">Bạn chưa bị tính phí</p>

                {/* Quick Info */}
                <div className="quick-info">
                  <div className="info-item">📍 {property.fullAddress}</div>
                  <div className="info-item">✅ Xác nhận ngay lập tức</div>
                  <div className="info-item">🚫 Hủy miễn phí trong 24h</div>
                </div>

                <div className="divider"></div>

                {/* House Rules */}
                <div className="rules-section">
                  <h3>Nội quy nhà</h3>
                  <div className="rules-list">
                    {property.houseRules.map((rule, index) => (
                      <div key={index} className="rule-item">• {rule}</div>
                    ))}
                  </div>
                </div>

                <div className="divider"></div>

                {/* Nearby Places */}
                <div className="nearby-section">
                  <h3>Địa điểm gần đây</h3>
                  <div className="nearby-list">
                    {property.nearbyPlaces.map((place, index) => (
                      <div key={index} className="nearby-item">
                        <span>{place.name}</span>
                        <span className="distance">{place.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <LoginDialog />
          <ImageDialog />
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;