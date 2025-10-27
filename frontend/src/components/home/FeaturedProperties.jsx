import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  IconButton,
  Button,
  alpha,
  Stack,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn,
  Favorite,
  FavoriteBorder,
  Star,
  Verified,
  Wifi,
  Pool,
  LocalDining,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';
import api from '../../utils/api';

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const [likedProperties, setLikedProperties] = useState(new Set([2]));
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const response = await api.getFeaturedHomestays(4);
        const homestays = response.homestays || [];
        
        const transformedHomestays = homestays.map(homestay => ({
          id: homestay.id,
          name: homestay.name,
          location: homestay.address,
          price: homestay.price_per_night,
          rating: homestay.avg_rating || 0,
          reviews: homestay.review_count || 0,
          image: homestay.images?.[0] || null,
          amenities: homestay.amenities || [],
          badge: homestay.featured ? 'Nổi bật' : null,
          verified: true,
          category: homestay.category || 'Homestay',
        }));
        
        setFeaturedProperties(transformedHomestays);
      } catch (error) {
        console.error('Error fetching homestays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, []);

  const handleLikeToggle = (propertyId) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
            <TrendingUp sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Homestay Nổi Bật
            </Typography>
          </Stack>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Khám phá những homestay được yêu thích nhất với trải nghiệm độc đáo,
            dịch vụ chất lượng cao và giá cả hợp lý
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => navigate('/search')}
                style={{
                  height: '520px',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                  const img = e.currentTarget.querySelector('.property-image');
                  if (img) img.style.transform = 'scale(1.05)';
                  const overlay = e.currentTarget.querySelector('.property-overlay');
                  if (overlay) overlay.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  const img = e.currentTarget.querySelector('.property-image');
                  if (img) img.style.transform = 'scale(1)';
                  const overlay = e.currentTarget.querySelector('.property-overlay');
                  if (overlay) overlay.style.opacity = '0';
                }}
              >
                {/* Image Container */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '220px',
                  flexShrink: 0
                }}>
                  {property.image ? (
                    <img
                      src={`http://localhost:8000${property.image}`}
                      alt={property.name}
                      className="property-image"
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: property.image ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      transition: 'transform 0.4s ease',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    {property.category}
                  </div>

                  {/* Overlay */}
                  <div
                    className="property-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/search');
                      }}
                      style={{
                        backgroundColor: 'white',
                        color: '#1976d2',
                        border: 'none',
                        fontWeight: '600',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>

                  {/* Badge */}
                  {property.badge && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '12px',
                      height: '24px',
                      padding: '0 8px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {property.badge}
                    </div>
                  )}

                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle(property.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {likedProperties.has(property.id) ? (
                      <Favorite sx={{ color: '#f44336', fontSize: 18 }} />
                    ) : (
                      <FavoriteBorder sx={{ color: 'text.secondary', fontSize: 18 }} />
                    )}
                  </button>
                </div>

                {/* Content Container */}
                <div style={{
                  flex: 1,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '300px',
                  overflow: 'hidden'
                }}>
                  {/* Category & Verified */}
                  <div style={{
                    height: '24px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#1976d2',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {property.category}
                    </span>
                    {property.verified && (
                      <Verified sx={{ fontSize: 16, color: 'success.main', ml: 1 }} />
                    )}
                  </div>

                  {/* Property Name */}
                  <div style={{
                    height: '48px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}>
                    <h3 style={{
                      fontWeight: '700',
                      color: '#1a202c',
                      fontSize: '1.1rem',
                      lineHeight: '1.3',
                      margin: '0',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}>
                      {property.name}
                    </h3>
                  </div>

                  {/* Location */}
                  <div style={{
                    height: '24px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5, flexShrink: 0 }} />
                    <span style={{
                      color: '#64748b',
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {property.location}
                    </span>
                  </div>

                  {/* Rating */}
                  <div style={{
                    height: '24px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Rating
                      value={property.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{
                        mr: 1,
                        '& .MuiRating-iconFilled': {
                          color: '#ffb400'
                        },
                        '& .MuiRating-icon': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                    <span style={{
                      fontWeight: '600',
                      color: '#1a202c',
                      marginRight: '4px',
                      fontSize: '14px'
                    }}>
                      {property.rating}
                    </span>
                    <span style={{
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      ({property.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Amenities */}
                  <div style={{
                    height: '56px',
                    marginBottom: '16px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap'
                    }}>
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={amenity.id || index}
                          style={{
                            fontSize: '11px',
                            height: '24px',
                            padding: '0 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '80px'
                          }}
                        >
                          {amenity.name || amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    marginTop: 'auto',
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px'
                    }}>
                      <span style={{
                        fontWeight: '800',
                        color: '#1976d2',
                        fontSize: '1.4rem'
                      }}>
                        {property.price.toLocaleString()}đ
                      </span>
                      <span style={{
                        fontWeight: '500',
                        color: '#64748b',
                        fontSize: '14px'
                      }}>
                        /đêm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <Box textAlign="center" sx={{ mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/search')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(25, 118, 210, 0.6)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Khám phá tất cả homestay
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedProperties;