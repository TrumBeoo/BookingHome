import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Grid, Box, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar,
  Pagination, Skeleton, Fab
} from '@mui/material';
import { Refresh, KeyboardArrowUp } from '@mui/icons-material';
import RoomCategoryCard from './RoomCategoryCard';
import RoomCategoryFilter from './RoomCategoryFilter';
import Layout from '../common/Layout';
import { roomCategoriesAPI } from '../../services/roomCategoriesAPI';

const RoomCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriesData, filtersData] = await Promise.all([
        roomCategoriesAPI.getCategories({ page: 1, limit: 12 }),
        roomCategoriesAPI.getFilterOptions()
      ]);
      const apiCategories = categoriesData.results || categoriesData;
      const demoCategories = [
        { id: 5, name: 'Phòng Suite', description: 'Phòng sang trọng với không gian rộng rãi và tiện nghi cao cấp', max_guests: 4, room_size: 50, view_type: 'Biển', has_kitchen: true, has_balcony: true, is_pet_friendly: false, base_price: 2500000, tags: [] },
        { id: 6, name: 'Phòng Family', description: 'Phòng rộng rãi dành cho gia đình, có 2 giường lớn', max_guests: 6, room_size: 45, view_type: 'Vườn', has_kitchen: true, has_balcony: true, is_pet_friendly: true, base_price: 2000000, tags: [] },
        { id: 7, name: 'Phòng VIP', description: 'Phòng cao cấp nhất với thiết bị hiện đại và dịch vụ đặc biệt', max_guests: 2, room_size: 60, view_type: 'Biển', has_kitchen: true, has_balcony: true, is_pet_friendly: false, base_price: 3500000, tags: [] },
        { id: 8, name: 'Phòng Penthouse', description: 'Phòng tầng thượng với view 360 độ tuyệt đẹp', max_guests: 4, room_size: 80, view_type: 'Toàn cảnh', has_kitchen: true, has_balcony: true, is_pet_friendly: true, base_price: 5000000, tags: [] }
      ];
      setCategories([...apiCategories, ...demoCategories]);
      setPagination({
        page: categoriesData.page || 1,
        totalPages: categoriesData.total_pages || 1,
        totalItems: (categoriesData.total || apiCategories.length) + 4
      });
      setFilterOptions(filtersData);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: 1, limit: 12 };
      
      if (filters.search) params.search = filters.search;
      if (filters.view_type) params.view_type = filters.view_type;
      if (filters.has_balcony !== null) params.has_balcony = filters.has_balcony;
      if (filters.has_kitchen !== null) params.has_kitchen = filters.has_kitchen;
      if (filters.is_pet_friendly !== null) params.is_pet_friendly = filters.is_pet_friendly;
      if (filters.max_guests) params.max_guests = filters.max_guests;
      if (filters.price_range) {
        params.min_price = filters.price_range[0];
        params.max_price = filters.price_range[1];
      }
      if (filters.tags?.length > 0) params.tags = filters.tags.join(',');
      if (filters.sort_by) params.sort_by = filters.sort_by;

      setCurrentFilters(params);
      const data = await roomCategoriesAPI.getCategories(params);
      setCategories(data.results || data);
      setPagination({
        page: data.page || 1,
        totalPages: data.total_pages || 1,
        totalItems: data.total || data.length
      });
    } catch (err) {
      setError('Không thể lọc dữ liệu. Vui lòng thử lại.');
      console.error('Error filtering data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = async (event, page) => {
    try {
      setLoading(true);
      const params = { ...currentFilters, page, limit: 12 };
      const data = await roomCategoriesAPI.getCategories(params);
      setCategories(data.results || data);
      setPagination(prev => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Không thể tải trang. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (categoryId, isFavorite) => {
    try {
      // API call to toggle favorite
      setSnackbar({
        open: true,
        message: isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra. Vui lòng thử lại.',
        severity: 'error'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getRoomCategoryImage = (category) => {
    if (category.images?.[0]) {
      return `http://localhost:8000${category.images[0]}`;
    }
    const imageMap = {
      1: '/images/room_categories/2.jpg',
      2: '/images/room_categories/2.jpg',
      3: '/images/room_categories/3.jpg',
      4: '/images/room_categories/4.jpg',
      5: '/images/room_categories/5.jpg',
      6: '/images/room_categories/6.jpg',
      7: '/images/room_categories/7.jpg',
      8: '/images/room_categories/8.jpg',
    };
    return imageMap[category.id] || `/images/room_categories/${((category.id - 1) % 7) + 2}.jpg`;
  };

  if (loading && !categories.length) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loại phòng
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Khám phá các loại phòng đa dạng phù hợp với nhu cầu của bạn
        </Typography>
        {pagination.totalItems > 0 && (
          <Typography variant="body2" color="text.secondary">
            Tìm thấy {pagination.totalItems} loại phòng
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filterOptions && (
        <RoomCategoryFilter
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
      )}

      {/* Custom Grid Layout with Pure HTML/CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .room-categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
            padding: 0;
          }
          
          .room-category-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            transition: all 0.3s ease;
            position: relative;
            height: 400px;
            cursor: pointer;
          }
          
          .room-category-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          }
          
          .card-image-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            background: #f5f5f5;
          }
          
          .card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .room-category-card:hover .card-image {
            transform: scale(1.1);
          }
          
          .card-overlay {
            display: none;
          }
          
          .favorite-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 3;
            backdrop-filter: blur(10px);
          }
          
          .favorite-btn:hover {
            background: rgba(255, 255, 255, 1);
            transform: scale(1.1);
          }
          
          .card-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            z-index: 2;
            color: white;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.75) 0%,
              rgba(0, 0, 0, 0.4) 30%,
              rgba(0, 0, 0, 0) 100%
            );
          }
          
          .card-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: white;
            margin: 0 0 6px 0;
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .card-description {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.85rem;
            line-height: 1.3;
            margin: 0 0 10px 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .card-features {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            flex-wrap: wrap;
          }
          
          .feature-item {
            display: flex;
            align-items: center;
            gap: 3px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.75rem;
            background: rgba(255, 255, 255, 0.15);
            padding: 3px 6px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
          }
          
          .feature-icon {
            width: 14px;
            height: 14px;
            fill: currentColor;
          }
          
          .card-amenities {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
            min-height: 20px;
          }
          
          .amenity-icon {
            width: 18px;
            height: 18px;
            color: #4caf50;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
          }
          
          .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 10px;
            min-height: 24px;
          }
          
          .tag-chip {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .card-price {
            font-size: 1.2rem;
            font-weight: 700;
            color: #FFD700;
            margin: 0 0 12px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
          
          .card-actions {
            display: flex;
            gap: 8px;
          }
          
          .btn {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            text-align: center;
            border: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
          }
          
          .btn-outline {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.4);
            color: white;
            flex: 1;
          }
          
          .btn-outline:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.6);
            transform: translateY(-2px);
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #1976d2, #1565c0);
            color: white;
            min-width: 70px;
            box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #1565c0, #0d47a1);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
          }
          
          .loading-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          .skeleton-image {
            height: 200px;
            background: #f0f0f0;
          }
          
          .skeleton-text {
            height: 16px;
            background: #f0f0f0;
            border-radius: 4px;
            margin-bottom: 8px;
          }
          
          .skeleton-text.title {
            height: 20px;
            width: 80%;
          }
          
          .skeleton-text.description {
            height: 14px;
            width: 100%;
          }
          
          .skeleton-text.price {
            height: 18px;
            width: 60%;
          }
          
          @media (max-width: 768px) {
            .room-categories-grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 16px;
            }
            
            .room-category-card {
              height: 360px;
            }
            
            .card-content {
              padding: 16px;
            }
            
            .card-title {
              font-size: 1.2rem;
            }
            
            .card-description {
              font-size: 0.8rem;
            }
            
            .card-features {
              gap: 6px;
            }
            
            .feature-item {
              font-size: 0.7rem;
              padding: 2px 5px;
            }
            
            .card-price {
              font-size: 1.1rem;
            }
            
            .btn {
              padding: 8px 12px;
              font-size: 0.75rem;
            }
          }
          
          @media (max-width: 480px) {
            .room-categories-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
            
            .room-category-card {
              height: 340px;
            }
            
            .card-content {
              padding: 14px;
            }
            
            .card-title {
              font-size: 1.1rem;
              margin-bottom: 4px;
            }
            
            .card-description {
              font-size: 0.75rem;
              margin-bottom: 8px;
            }
            
            .card-features {
              gap: 4px;
              margin-bottom: 6px;
            }
            
            .feature-item {
              font-size: 0.65rem;
              padding: 2px 4px;
            }
            
            .card-amenities {
              margin-bottom: 6px;
            }
            
            .amenity-icon {
              width: 16px;
              height: 16px;
            }
            
            .card-tags {
              margin-bottom: 8px;
            }
            
            .tag-chip {
              font-size: 0.65rem;
              padding: 1px 6px;
            }
            
            .card-price {
              font-size: 1rem;
              margin-bottom: 10px;
            }
            
            .card-actions {
              gap: 6px;
            }
            
            .btn {
              padding: 6px 10px;
              font-size: 0.7rem;
            }
            
            .favorite-btn {
              width: 40px;
              height: 40px;
              top: 12px;
              right: 12px;
            }
          }
        `
      }} />
      
      <div className="room-categories-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="room-category-card">
              <div className="card-image-container">
                <div className="skeleton-image loading-skeleton"></div>
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <div className="skeleton-text title loading-skeleton" style={{background: 'rgba(255,255,255,0.3)', height: '20px', marginBottom: '6px'}}></div>
                <div className="skeleton-text description loading-skeleton" style={{background: 'rgba(255,255,255,0.2)', height: '14px', marginBottom: '6px'}}></div>
                <div className="skeleton-text description loading-skeleton" style={{background: 'rgba(255,255,255,0.2)', height: '14px', width: '70%', marginBottom: '10px'}}></div>
                <div style={{display: 'flex', gap: '6px', marginBottom: '8px'}}>
                  <div style={{height: '20px', width: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px'}} className="loading-skeleton"></div>
                  <div style={{height: '20px', width: '45px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px'}} className="loading-skeleton"></div>
                </div>
                <div style={{display: 'flex', gap: '6px', marginBottom: '8px'}}>
                  <div style={{height: '18px', width: '18px', background: 'rgba(76,175,80,0.3)', borderRadius: '50%'}} className="loading-skeleton"></div>
                  <div style={{height: '18px', width: '18px', background: 'rgba(76,175,80,0.3)', borderRadius: '50%'}} className="loading-skeleton"></div>
                </div>
                <div style={{display: 'flex', gap: '4px', marginBottom: '10px'}}>
                  <div style={{height: '18px', width: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px'}} className="loading-skeleton"></div>
                  <div style={{height: '18px', width: '35px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px'}} className="loading-skeleton"></div>
                </div>
                <div className="skeleton-text price loading-skeleton" style={{background: 'rgba(255,215,0,0.3)', height: '18px', width: '60%', marginBottom: '12px'}}></div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <div style={{height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', flex: 1}} className="loading-skeleton"></div>
                  <div style={{height: '32px', width: '70px', background: 'rgba(25,118,210,0.3)', borderRadius: '20px'}} className="loading-skeleton"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          categories.map((category) => (
            <div key={category.id} className="room-category-card" onClick={() => handleCategorySelect(category)}>
              <div className="card-image-container">
                <img 
                  src={getRoomCategoryImage(category)} 
                  alt={category.name}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = '/images/room_categories/2.jpg';
                  }}
                />
                <div className="card-overlay"></div>
                <button 
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(category.id, !category.is_favorite);
                  }}
                >
                  <svg className="feature-icon" viewBox="0 0 24 24">
                    {category.is_favorite ? (
                      <path fill="#f44336" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                    ) : (
                      <path fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"/>
                    )}
                  </svg>
                </button>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{category.name}</h3>
                <p className="card-description">{category.description}</p>
                
                <div className="card-features">
                  <div className="feature-item">
                    <svg className="feature-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16,4C16.88,4 17.67,4.5 18,5.26L19,7H20A2,2 0 0,1 22,9V16A2,2 0 0,1 20,18H19.5C19.5,19.38 18.38,20.5 17,20.5C15.62,20.5 14.5,19.38 14.5,18H9.5C9.5,19.38 8.38,20.5 7,20.5C5.62,20.5 4.5,19.38 4.5,18H4A2,2 0 0,1 2,16V11C2,9.89 2.89,9 4,9H6L8,4H16M7,19A1,1 0 0,0 8,18A1,1 0 0,0 7,17A1,1 0 0,0 6,18A1,1 0 0,0 7,19M17,19A1,1 0 0,0 18,18A1,1 0 0,0 17,17A1,1 0 0,0 16,18A1,1 0 0,0 17,19Z"/>
                    </svg>
                    <span>{category.max_guests} khách</span>
                  </div>
                  {category.room_size && (
                    <div className="feature-item">
                      <svg className="feature-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3,3H21V21H3V3M5,5V19H19V5H5Z"/>
                      </svg>
                      <span>{category.room_size}m²</span>
                    </div>
                  )}
                  {category.view_type && (
                    <div className="feature-item">
                      <svg className="feature-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                      </svg>
                      <span>{category.view_type}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-amenities">
                  {category.has_kitchen && (
                    <svg className="amenity-icon" viewBox="0 0 24 24" title="Có bếp">
                      <path fill="currentColor" d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.28,12.92 16.28,15.18 14.88,16.57C13.49,17.96 11.23,17.96 9.84,16.57L7.76,14.5L10.59,11.67L14.88,11.53M21.04,2.96L19.63,1.54L18.22,2.96L16.81,1.54L15.39,2.96L16.81,4.37L15.39,5.79L16.81,7.2L18.22,5.79L19.63,7.2L21.04,5.79L19.63,4.37L21.04,2.96Z"/>
                    </svg>
                  )}
                  {category.has_balcony && (
                    <svg className="amenity-icon" viewBox="0 0 24 24" title="Có ban công">
                      <path fill="currentColor" d="M10,10V8A2,2 0 0,1 12,6A2,2 0 0,1 14,8V10H15V8A3,3 0 0,0 12,5A3,3 0 0,0 9,8V10H10M6,10H18A1,1 0 0,1 19,11V21H17V19H7V21H5V11A1,1 0 0,1 6,10Z"/>
                    </svg>
                  )}
                  {category.is_pet_friendly && (
                    <svg className="amenity-icon" viewBox="0 0 24 24" title="Thân thiện với thú cưng">
                      <path fill="currentColor" d="M4.5,13C5.89,13 7,11.89 7,10.5C7,9.11 5.89,8 4.5,8C3.11,8 2,9.11 2,10.5C2,11.89 3.11,13 4.5,13M19.5,13C20.89,13 22,11.89 22,10.5C22,9.11 20.89,8 19.5,8C18.11,8 17,9.11 17,10.5C17,11.89 18.11,13 19.5,13M6,15.5C7.39,15.5 8.5,14.39 8.5,13C8.5,11.61 7.39,10.5 6,10.5C4.61,10.5 3.5,11.61 3.5,13C3.5,14.39 4.61,15.5 6,15.5M18,15.5C19.39,15.5 20.5,14.39 20.5,13C20.5,11.61 19.39,10.5 18,10.5C16.61,10.5 15.5,11.61 15.5,13C15.5,14.39 16.61,15.5 18,15.5M12,16C10.69,16 9.58,16.95 9.58,18.13C9.58,19.28 10.4,20.2 11.5,20.2C11.64,20.2 11.77,20.18 11.9,20.15C12.12,20.95 12.91,21.5 13.83,21.5C14.75,21.5 15.54,20.95 15.76,20.15C15.89,20.18 16,20.2 16.16,20.2C17.26,20.2 18.08,19.28 18.08,18.13C18.08,16.95 16.97,16 15.66,16H12Z"/>
                    </svg>
                  )}
                </div>
                
                <div className="card-tags">
                  {category.tags?.slice(0, 2).map((tag) => (
                    <span key={tag.id} className="tag-chip" style={{backgroundColor: tag.color + '20', color: tag.color}}>
                      {tag.name}
                    </span>
                  ))}
                  {category.tags?.length > 2 && (
                    <span className="tag-chip">
                      +{category.tags.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="card-price">
                  {category.base_price ? formatPrice(category.base_price) : 'Liên hệ'}/đêm
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect(category);
                    }}
                  >
                    Xem chi tiết
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/search?category=${category.id}`;
                    }}
                  >
                    Tìm
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {categories.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy loại phòng nào phù hợp
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác
          </Typography>
          <Button variant="outlined" onClick={loadInitialData}>
            Tải lại
          </Button>
        </Box>
      )}

      {/* Dialog chi tiết */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCategory && (
          <>
            <DialogTitle>{selectedCategory.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" paragraph>
                  {selectedCategory.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Số khách tối đa:</Typography>
                    <Typography>{selectedCategory.max_guests} người</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Diện tích:</Typography>
                    <Typography>{selectedCategory.room_size}m²</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Loại giường:</Typography>
                    <Typography>{selectedCategory.bed_type}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">View:</Typography>
                    <Typography>{selectedCategory.view_type}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>Tiện nghi:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {selectedCategory.amenities?.map((amenity, index) => (
                    <Box
                      key={index}
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      {amenity}
                    </Box>
                  ))}
                </Box>

                <Typography variant="h5" color="primary">
                  {formatPrice(selectedCategory.base_price)}/đêm
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Đóng
              </Button>
              <Button variant="contained" onClick={() => { setDialogOpen(false); window.location.href = `/search?category=${selectedCategory.id}`; }}>
                Tìm homestay có loại phòng này
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </Layout>
  );
};

export default RoomCategories;