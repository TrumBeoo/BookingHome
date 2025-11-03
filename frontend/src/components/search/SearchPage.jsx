import React, { useState, useEffect } from 'react';
import {
  Button,
  Pagination,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Box,
} from '@mui/material';
import {
  LocationOn,
  Favorite,
  FavoriteBorder,
  Wifi,
  LocalParking,
  Restaurant,
  Pool,
  Pets,
  AcUnit,
  Star,
} from '@mui/icons-material';

import Layout from '../common/Layout';
import SearchFilters from './SearchFilters';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import './SearchPage.css';

const SearchPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const location = searchParams.get('location');
    if (location) {
      setLocationFilter(location);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage, limit: 12 };
        
        if (locationFilter) {
          params.location = locationFilter;
        }
        
        const data = await api.getHomestays(params);
        
        const transformedHomestays = data.homestays.map(homestay => ({
          id: homestay.id,
          name: homestay.name,
          location: homestay.address,
          price: homestay.price_per_night,
          rating: homestay.avg_rating || 0,
          reviews: homestay.review_count || 0,
          images: homestay.images || [],
          amenities: homestay.amenities || [],
          description: homestay.description || 'Homestay tuyệt vời với nhiều tiện nghi',
          host: homestay.host_name || 'Host',
          maxGuests: homestay.max_guests || 2,
        }));
        
        setProperties(transformedHomestays);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error('Error fetching homestays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, [currentPage, locationFilter]);

  const amenityIcons = {
    wifi: <Wifi />,
    parking: <LocalParking />,
    restaurant: <Restaurant />,
    pool: <Pool />,
    pets: <Pets />,
    ac: <AcUnit />,
  };

  const handleFavoriteClick = (propertyId) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const handleBookNow = (propertyId) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }
    navigate(`/property/${propertyId}/booking`);
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const PropertySkeleton = () => (
    <div style={{
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '20px',
      fontFamily: 'Roboto, sans-serif',
      marginBottom: '16px',
      height: '200px'
    }}>
      {/* Image skeleton */}
      <div className="skeleton-pulse" style={{
        width: '280px',
        height: '160px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        marginRight: '20px',
        flexShrink: 0
      }} />
      
      {/* Content skeleton */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="skeleton-pulse" style={{
          height: '24px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '12px',
          width: '70%'
        }} />
        <div className="skeleton-pulse" style={{
          height: '16px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          width: '50%',
          marginBottom: '8px'
        }} />
        <div className="skeleton-pulse" style={{
          height: '16px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          width: '40%',
          marginBottom: '12px'
        }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div className="skeleton-pulse" style={{
            height: '20px',
            width: '60px',
            backgroundColor: '#f0f0f0',
            borderRadius: '12px'
          }} />
          <div className="skeleton-pulse" style={{
            height: '20px',
            width: '50px',
            backgroundColor: '#f0f0f0',
            borderRadius: '12px'
          }} />
        </div>
        <div className="skeleton-pulse" style={{
          height: '16px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          width: '90%',
          marginBottom: '8px'
        }} />
        <div className="skeleton-pulse" style={{
          height: '16px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          width: '60%'
        }} />
      </div>
      
      {/* Price and button skeleton */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        minWidth: '120px'
      }}>
        <div className="skeleton-pulse" style={{
          height: '24px',
          width: '80px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }} />
        <div className="skeleton-pulse" style={{
          height: '36px',
          width: '100px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px'
        }} />
      </div>
    </div>
  );

  const LoginDialog = () => (
    <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
      <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
      <DialogContent>
        <p style={{ fontFamily: 'Roboto, sans-serif' }}>
          Bạn cần đăng nhập để thêm vào danh sách yêu thích hoặc đặt phòng.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setLoginDialogOpen(false)}>Hủy</Button>
        <Button
          variant="contained"
          onClick={() => {
            setLoginDialogOpen(false);
            navigate('/login');
          }}
        >
          Đăng nhập
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Layout>

      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '32px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div className="search-container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {/* Filters Sidebar */}
            <div className="search-filters" style={{ width: '320px', flexShrink: 0 }}>
              <SearchFilters />
            </div>

            {/* Results */}
            <div className="search-results" style={{ flex: 1 }}>
              {/* Header */}
              <div className="search-header" style={{ marginBottom: '32px' }}>
                <h1 style={{
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  color: '#212121',
                  marginBottom: '8px',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {locationFilter ? `Homestay tại ${locationFilter}` : 'Homestay tại Việt Nam'}
                </h1>
                <p style={{
                  color: '#757575',
                  fontSize: '1.125rem',
                  margin: 0,
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${properties.length} homestay`}
                </p>
              </div>

              {/* Guest user notice */}
              {!isAuthenticated && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 3 }}
                  action={
                    <Button color="inherit" size="small" onClick={() => navigate('/login')}>
                      Đăng nhập
                    </Button>
                  }
                >
                  Đăng nhập để lưu yêu thích và đặt phòng nhanh chóng!
                </Alert>
              )}

              {/* Property List - Horizontal Layout */}
              <div className="property-list" style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '30px'
              }}>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <PropertySkeleton key={index} />
                  ))
                ) : (
                  properties.map((property) => (
                    <div
                      key={property.id}
                      className="property-card-horizontal"
                      style={{
                        display: 'flex',
                        textAlign: 'left',
                        padding: '20px',
                        border: 'none',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        fontFamily: 'Roboto, sans-serif',
                        position: 'relative',
                        height: '200px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onClick={() => handleViewDetails(property.id)}
                    >
                      {/* Image Section */}
                      <div style={{ 
                        position: 'relative', 
                        width: '280px',
                        height: '160px',
                        marginRight: '20px',
                        flexShrink: 0
                      }}>
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={`http://localhost:8000${property.images[0]}`}
                            alt={property.name}
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              console.log('Image failed to load:', property.images[0]);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="property-image"
                          style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: property.images && property.images.length > 0 && property.images[0] !== '/api/placeholder/400/300' ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            opacity: 0.8
                          }}
                        >
                          Hình ảnh homestay
                        </div>

                        {/* Favorite Button */}
                        <button
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteClick(property.id);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
                          }}
                        >
                          {favorites.has(property.id) ? (
                            <Favorite sx={{ color: 'red', fontSize: '18px' }} />
                          ) : (
                            <FavoriteBorder sx={{ fontSize: '18px' }} />
                          )}
                        </button>

                        {/* Host Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: '#212121'
                          }}
                        >
                          Host: {property.host}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        paddingRight: '20px'
                      }}>
                        {/* Top Content */}
                        <div>
                          {/* Property Name */}
                          <h3 style={{
                            fontWeight: 600,
                            marginBottom: '8px',
                            color: '#212121',
                            fontSize: '1.25rem',
                            fontFamily: 'Roboto, sans-serif',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {property.name}
                          </h3>

                          {/* Location */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            color: '#757575'
                          }}>
                            <LocationOn sx={{ fontSize: 16, marginRight: '4px' }} />
                            <span style={{ fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                              {property.location}
                            </span>
                          </div>

                          {/* Rating */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '12px'
                          }}>
                            <Rating
                              value={property.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{ marginRight: '8px' }}
                            />
                            <span style={{ 
                              fontSize: '0.875rem', 
                              color: '#757575',
                              fontFamily: 'Roboto, sans-serif'
                            }}>
                              {property.rating} ({property.reviews} đánh giá)
                            </span>
                          </div>

                          {/* Amenities */}
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{
                              display: 'flex',
                              gap: '6px',
                              flexWrap: 'wrap'
                            }}>
                              {property.amenities.slice(0, 4).map((amenity, index) => (
                                <span
                                  key={amenity.id || index}
                                  style={{
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    border: '1px solid #bbdefb'
                                  }}
                                >
                                  {amenity.name || amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Description */}
                          <p style={{
                            color: '#757575',
                            lineHeight: 1.5,
                            fontSize: '0.875rem',
                            fontFamily: 'Roboto, sans-serif',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            margin: 0
                          }}>
                            {property.description}
                          </p>
                        </div>
                      </div>

                      {/* Price and Action Section */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        minWidth: '140px'
                      }}>
                        {/* Price */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontWeight: 700,
                            color: '#1976d2',
                            fontSize: '1.5rem',
                            fontFamily: 'Roboto, sans-serif'
                          }}>
                            {property.price.toLocaleString()}đ
                          </div>
                          <div style={{
                            fontWeight: 400,
                            color: '#757575',
                            fontSize: '0.875rem',
                            fontFamily: 'Roboto, sans-serif'
                          }}>
                            /đêm
                          </div>
                        </div>
                        
                        {/* Book Button */}
                        <button
                          style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'Roboto, sans-serif',
                            minWidth: '100px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookNow(property.id);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1565c0';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1976d2';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          Đặt ngay
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog />

    </Layout>
  );
};

export default SearchPage;