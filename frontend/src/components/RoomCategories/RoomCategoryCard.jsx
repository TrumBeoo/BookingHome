import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button, Skeleton, IconButton, Tooltip } from '@mui/material';
import { People, SquareFoot, Visibility, Kitchen, Balcony, Pets, Favorite, FavoriteBorder } from '@mui/icons-material';

const RoomCategoryCard = ({ category, onSelect, loading = false, onFavorite }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(category?.is_favorite || false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite?.(category.id, !isFavorite);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
          <Skeleton variant="text" sx={{ mb: 2 }} />
          <Skeleton variant="text" sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={60} height={24} />
          </Box>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 2 }} />
          <Skeleton variant="rectangular" height={36} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' } }}>
      <Box sx={{ position: 'relative' }}>
        {imageLoading && (
          <Skeleton variant="rectangular" height={200} sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        )}
        <CardMedia
          component="img"
          height="200"
          image={imageError ? '/images/room-placeholder.jpg' : (category.images?.[0] ? `http://localhost:8000${category.images[0]}` : '/images/room-placeholder.jpg')}
          alt={category.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sx={{ display: imageLoading ? 'none' : 'block' }}
        />
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
          }}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {category.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {category.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Số khách tối đa">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <People fontSize="small" color="action" />
              <Typography variant="body2">{category.max_guests}</Typography>
            </Box>
          </Tooltip>
          {category.room_size && (
            <Tooltip title="Diện tích">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SquareFoot fontSize="small" color="action" />
                <Typography variant="body2">{category.room_size}m²</Typography>
              </Box>
            </Tooltip>
          )}
          {category.view_type && (
            <Tooltip title="Loại view">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Visibility fontSize="small" color="action" />
                <Typography variant="body2">{category.view_type}</Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {category.has_kitchen && (
            <Tooltip title="Có bếp">
              <Kitchen fontSize="small" color="success" />
            </Tooltip>
          )}
          {category.has_balcony && (
            <Tooltip title="Có ban công">
              <Balcony fontSize="small" color="info" />
            </Tooltip>
          )}
          {category.is_pet_friendly && (
            <Tooltip title="Thân thiện với thú cưng">
              <Pets fontSize="small" color="warning" />
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {category.tags?.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              sx={{ 
                backgroundColor: tag.color + '20',
                color: tag.color,
                fontSize: '0.75rem'
              }}
            />
          ))}
        </Box>

        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          {category.base_price ? formatPrice(category.base_price) : 'Liên hệ'}/đêm
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={() => onSelect(category)}
          >
            Xem chi tiết
          </Button>
          <Button 
            variant="contained" 
            onClick={() => window.open(`/search?category=${category.id}`, '_blank')}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Tìm
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCategoryCard;