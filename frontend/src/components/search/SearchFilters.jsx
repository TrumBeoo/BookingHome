import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Rating,
  Chip,
  IconButton,
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
    <Card sx={{ position: 'sticky', top: 100 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Bộ lọc
          </Typography>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={clearAllFilters}
              startIcon={<Clear />}
              sx={{ color: 'text.secondary' }}
            >
              Xóa tất cả
            </Button>
          )}
        </Box>

        {/* Price Range */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Khoảng giá (VNĐ/đêm)
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={100000}
            max={10000000}
            step={100000}
            valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {(priceRange[0] / 1000000).toFixed(1)}M đ
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {(priceRange[1] / 1000000).toFixed(1)}M đ
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Property Types */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Loại hình lưu trú
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {propertyTypeOptions.map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => handlePropertyTypeChange(type)}
                color={propertyTypes.includes(type) ? 'primary' : 'default'}
                variant={propertyTypes.includes(type) ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Rating */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Đánh giá tối thiểu
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <Box
                key={rating}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: minRating === rating ? 'primary.light' : 'transparent',
                  color: minRating === rating ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: minRating === rating ? 'primary.main' : 'grey.100',
                  },
                }}
                onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              >
                <Rating value={rating} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {rating} sao trở lên
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Amenities */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Tiện nghi
          </Typography>
          <FormGroup>
            {amenities.map((amenity) => (
              <FormControlLabel
                key={amenity.id}
                control={
                  <Checkbox
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleAmenityChange(amenity.id)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>
                      {amenity.icon}
                    </Box>
                    {amenity.label}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>

        {/* Apply Filters Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Áp dụng bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;