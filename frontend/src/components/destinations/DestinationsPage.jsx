import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import destinationService from '../../services/destinationService';
import './DestinationsPage.css';

const DestinationsPage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    province: '',
    destination_type: '',
    season: '',
    search: '',
    sort_by: 'featured'
  });
  const [provinces, setProvinces] = useState([]);
  const [types, setTypes] = useState([]);

  // Background images for destinations (thay đổi đường dẫn ảnh tại đây)
  const backgroundImages = [
    '/images/destinations/bg1.jpg',
    '/images/destinations/bg2.jpg', 
    '/images/destinations/bg3.jpg',
    '/images/destinations/bg4.jpg',
    '/images/destinations/bg5.jpg',
    '/images/destinations/bg6.jpg',
    '/images/destinations/bg7.jpg',
    '/images/destinations/bg8.jpg'
  ];

  // Gradient colors for destinations (fallback nếu ảnh không load được)
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ];

  useEffect(() => {
    console.log('DestinationsPage mounted, filters:', filters);
    fetchDestinations();
    fetchFiltersData();
  }, [filters]);

  useEffect(() => {
    console.log('Destinations state updated:', destinations);
  }, [destinations]);

  useEffect(() => {
    console.log('Loading state:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('Error state:', error);
  }, [error]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      console.log('Fetching destinations with filters:', filters);
      const response = await destinationService.getDestinations(filters);
      console.log('Destinations response:', response);
      setDestinations(response.destinations || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Không thể tải danh sách điểm đến. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const [provincesResponse, typesResponse] = await Promise.all([
        destinationService.getDestinationProvinces(),
        destinationService.getDestinationTypes()
      ]);
      setProvinces(provincesResponse.provinces || []);
      setTypes(typesResponse.types || []);
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  const handleDestinationClick = (destination) => {
    navigate(`/search?location=${encodeURIComponent(destination.name)}`);
  };

  return (
    <Layout>
      <div className="destinations-page">
        <div className="destinations-container">
          {/* Header */}
          <div className="destinations-header">
            <h1 className="page-title">Khám Phá Các Điểm Đến</h1>
            <p className="page-description">
              Từ núi rừng hùng vĩ đến bãi biển trong xanh, Việt Nam có vô số địa điểm 
              tuyệt đẹp đang chờ bạn khám phá
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải danh sách điểm đến...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button 
                className="retry-button"
                onClick={fetchDestinations}
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Destinations List */}
          {!loading && !error && (
            <div className="destinations-list">
              {destinations.length === 0 ? (
                <div className="empty-state">
                  <p>Không tìm thấy điểm đến nào.</p>
                </div>
              ) : (
                destinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    className="destination-card horizontal-card"
                    style={{
                      backgroundImage: `url(${backgroundImages[index % backgroundImages.length]}), ${gradients[index % gradients.length]}`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => handleDestinationClick(destination)}
                  >
                    {/* Background Overlay */}
                    <div className="card-overlay"></div>
                    
                    {/* Trending Badge */}
                    {destination.is_featured && (
                      <div className="trending-badge">
                        <span className="trending-icon">🔥</span>
                        <span>Nổi bật</span>
                      </div>
                    )}

                    {/* Destination Image */}
                    {destination.banner_image && (
                      <div className="destination-image">
                        <img 
                          src={destination.banner_image} 
                          alt={destination.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="card-content">
                      <div className="destination-info">
                        <div className="location-header">
                          <h3 className="destination-name">{destination.name}</h3>
                          <div className="destination-location">
                            <span className="location-icon">📍</span>
                            <span>{destination.province}</span>
                          </div>
                        </div>
                        
                        <p className="destination-description">
                          {destination.short_description}
                        </p>
                        
                        <div className="destination-stats">
                          <div className="stat-item">
                            <span className="stat-icon">🏠</span>
                            <span className="stat-value">{destination.homestay_count} homestay</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-icon">⭐</span>
                            <span className="stat-value">
                              {destination.avg_rating}/5 ({destination.review_count} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="card-decoration">
                      <div className="decoration-circle circle-1"></div>
                      <div className="decoration-circle circle-2"></div>
                      <div className="decoration-circle circle-3"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h2 className="cta-title">Không tìm thấy điểm đến yêu thích?</h2>
              <p className="cta-description">
                Hãy liên hệ với chúng tôi để được tư vấn về những địa điểm du lịch 
                tuyệt vời khác trên khắp Việt Nam
              </p>
              <button 
                className="cta-button"
                onClick={() => navigate('/contact')}
              >
                <span className="button-icon">📞</span>
                <span>Liên hệ tư vấn</span>
              </button>
            </div>
            
            {/* CTA Background Decoration */}
            <div className="cta-decoration">
              <div className="decoration-shape shape-1"></div>
              <div className="decoration-shape shape-2"></div>
              <div className="decoration-shape shape-3"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DestinationsPage;