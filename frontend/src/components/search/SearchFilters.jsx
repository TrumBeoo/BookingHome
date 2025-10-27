import React, { useState } from 'react';
import {
  Typography,
  Box,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import {
  Wifi,
  LocalParking,
  Restaurant,
  Pool,
  Pets,
  AcUnit,
  Clear,
} from '@mui/icons-material';

const SearchFilters = () => {
  const [priceRange, setPriceRange] = useState([500000, 5000000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const amenities = [
    { id: 'wifi', label: 'WiFi miễn phí', icon: <Wifi /> },
    { id: 'parking', label: 'Bãi đậu xe', icon: <LocalParking /> },
    { id: 'restaurant', label: 'Nhà hàng', icon: <Restaurant /> },
    { id: 'pool', label: 'Hồ bơi', icon: <Pool /> },
    { id: 'pets', label: 'Cho phép thú cưng', icon: <Pets /> },
    { id: 'ac', label: 'Điều hòa', icon: <AcUnit /> },
  ];

  const propertyTypeOptions = [
    'Villa',
    'Homestay',
    'Resort mini',
    'Nhà sàn',
    'Bungalow',
    'Căn hộ',
  ];

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([500000, 5000000]);
    setSelectedAmenities([]);
    setMinRating(0);
    setPropertyTypes([]);
  };

  const hasActiveFilters = selectedAmenities.length > 0 || 
    minRating > 0 || 
    propertyTypes.length > 0 ||
    priceRange[0] !== 500000 || 
    priceRange[1] !== 5000000;

  return (
    <div style={{
      position: 'sticky',
      top: '100px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '24px',
      fontFamily: 'Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h3 style={{
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#212121',
          margin: 0,
          fontFamily: 'Roboto, sans-serif'
        }}>
          Bộ lọc tìm kiếm
        </h3>
        {hasActiveFilters && (
          <Button
            size="small"
            onClick={clearAllFilters}
            startIcon={<Clear />}
            sx={{ 
              color: '#757575',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{
          fontWeight: 600,
          fontSize: '1.1rem',
          color: '#212121',
          marginBottom: '16px',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Khoảng giá (VNĐ/đêm)
        </h4>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={100000}
            max={10000000}
            step={100000}
            valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
            sx={{ 
              mb: 2,
              color: '#1976d2',
              '& .MuiSlider-thumb': {
                backgroundColor: '#1976d2',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#1976d2',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#e0e0e0',
              }
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#757575',
              fontFamily: 'Roboto, sans-serif'
            }}>
              {(priceRange[0] / 1000000).toFixed(1)}M đ
            </span>
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#757575',
              fontFamily: 'Roboto, sans-serif'
            }}>
              {(priceRange[1] / 1000000).toFixed(1)}M đ
            </span>
          </div>
        </Box>
      </div>

      {/* Property Types */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{
          fontWeight: 600,
          fontSize: '1.1rem',
          color: '#212121',
          marginBottom: '16px',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Loại hình lưu trú
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {propertyTypeOptions.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => handlePropertyTypeChange(type)}
              color={propertyTypes.includes(type) ? 'primary' : 'default'}
              variant={propertyTypes.includes(type) ? 'filled' : 'outlined'}
              sx={{ 
                marginBottom: '8px',
                fontFamily: 'Roboto, sans-serif',
                '&:hover': {
                  backgroundColor: propertyTypes.includes(type) ? '#1565c0' : '#f5f5f5'
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{
          fontWeight: 600,
          fontSize: '1.1rem',
          color: '#212121',
          marginBottom: '16px',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Đánh giá tối thiểu
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <div
              key={rating}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: minRating === rating ? '#1976d2' : 'transparent',
                color: minRating === rating ? 'white' : '#212121',
                transition: 'all 0.3s ease',
                fontFamily: 'Roboto, sans-serif'
              }}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              onMouseEnter={(e) => {
                if (minRating !== rating) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (minRating !== rating) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Rating 
                value={rating} 
                readOnly 
                size="small" 
                sx={{ 
                  mr: 1,
                  '& .MuiRating-iconFilled': {
                    color: minRating === rating ? 'white' : '#ffc107'
                  }
                }} 
              />
              <span style={{ fontSize: '0.875rem' }}>
                {rating} sao trở lên
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{
          fontWeight: 600,
          fontSize: '1.1rem',
          color: '#212121',
          marginBottom: '16px',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Tiện nghi
        </h4>
        <FormGroup>
          {amenities.map((amenity) => (
            <FormControlLabel
              key={amenity.id}
              control={
                <Checkbox
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                  color="primary"
                  sx={{
                    '&.Mui-checked': {
                      color: '#1976d2'
                    }
                  }}
                />
              }
              label={
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontFamily: 'Roboto, sans-serif'
                }}>
                  <div style={{ 
                    marginRight: '8px', 
                    color: '#757575',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {amenity.icon}
                  </div>
                  <span style={{ fontSize: '0.875rem' }}>
                    {amenity.label}
                  </span>
                </div>
              }
              sx={{
                marginBottom: '4px',
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem'
                }
              }}
            />
          ))}
        </FormGroup>
      </div>

      {/* Apply Filters Button */}
      <button
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'Roboto, sans-serif',
          marginTop: '16px'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#1565c0';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#1976d2';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
};

export default SearchFilters;