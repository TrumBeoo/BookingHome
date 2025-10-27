import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  CloudUpload,
  Star,
  StarBorder,
  ArrowBack,
  Visibility,
  Download,
} from '@mui/icons-material';
import ApiService from '../../services/api';

const HomestayImages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [homestay, setHomestay] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, image: null });
  const [uploading, setUploading] = useState(false);
  const [previewDialog, setPreviewDialog] = useState({ open: false, image: null });

  useEffect(() => {
    loadHomestayImages();
  }, [id]);

  const loadHomestayImages = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load homestay images from API
      try {
        const homestayResponse = await ApiService.getHomestayImages(id);
        const homestayData = homestayResponse.homestay || homestayResponse.data || homestayResponse;
        
        if (!homestayData) {
          throw new Error('Không tìm thấy thông tin homestay');
        }
        
        setHomestay(homestayData);
        
        // Transform images data
        const transformedImages = (homestayData.images || []).map(img => ({
          id: img.id || Math.random(),
          url: img.image_path ? `${ApiService.baseURL || ''}${img.image_path}` : img.url || '/images/placeholder.jpg',
          name: img.alt_text || img.name || `Ảnh ${homestayData.name}`,
          is_primary: img.is_primary || false,
          uploaded_at: img.uploaded_at || new Date().toISOString().split('T')[0],
          size: img.size || 'Unknown',
        }));
        
        setImages(transformedImages);
      } catch (apiError) {
        console.warn('API failed, trying basic homestay info:', apiError);
        
        // Fallback: try to get basic homestay info
        const homestayResponse = await ApiService.getHomestay(id);
        const homestayData = homestayResponse.data || homestayResponse.homestay || homestayResponse;
        
        if (homestayData) {
          setHomestay(homestayData);
          setImages([]); // No images available
        } else {
          throw new Error('Không tìm thấy thông tin homestay');
        }
      }
    } catch (error) {
      console.error('Failed to load homestay images:', error);
      setError(error.message || 'Không thể tải hình ảnh homestay. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setError('Một số file không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP và tối đa 10MB.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Try to upload images via API
      try {
        const response = await ApiService.uploadHomestayImages(id, validFiles);
        
        if (response && response.images) {
          // Transform uploaded images
          const newImages = response.images.map(img => ({
            id: img.id || Date.now() + Math.random(),
            url: img.path ? `${ApiService.baseURL || ''}${img.path}` : img.url,
            name: img.filename || img.name,
            is_primary: img.is_primary || false,
            uploaded_at: new Date().toISOString().split('T')[0],
            size: img.size || 'Unknown',
          }));
          
          setImages(prev => [...prev, ...newImages]);
          setSuccess(`Đã tải lên ${validFiles.length} hình ảnh thành công!`);
        } else {
          throw new Error('Không nhận được phản hồi từ server');
        }
      } catch (apiError) {
        throw apiError;
      }
      
      // Clear file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Failed to upload images:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải lên hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image) => {
    if (!image || !image.id) {
      setError('Không tìm thấy thông tin hình ảnh');
      return;
    }

    try {
      // Try API call first
      try {
        await ApiService.deleteHomestayImage(id, image.id);
        setSuccess('Đã xóa hình ảnh thành công!');
        loadHomestayImages();
      } catch (apiError) {
        throw apiError;
      }
      setDeleteDialog({ open: false, image: null });
    } catch (error) {
      console.error('Failed to delete image:', error);
      setError('Có lỗi xảy ra khi xóa hình ảnh: ' + (error.message || 'Không thể xóa hình ảnh'));
    }
  };

  const handleSetPrimary = async (image) => {
    if (!image || !image.id) {
      setError('Không tìm thấy thông tin hình ảnh');
      return;
    }

    try {
      // Try API call first
      try {
        await ApiService.setPrimaryImage(id, image.id);
        setSuccess('Đã đặt làm hình ảnh chính!');
        loadHomestayImages();
      } catch (apiError) {
        throw apiError;
      }
    } catch (error) {
      console.error('Failed to set primary image:', error);
      setError('Có lỗi xảy ra: ' + (error.message || 'Không thể đặt hình ảnh chính'));
    }
  };

  const handleBack = () => {
    navigate('/dashboard/homestays');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" gutterBottom>
              Quản lý hình ảnh
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {homestay?.name || 'Homestay'}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-button"
            multiple
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-button">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUpload />}
              disabled={uploading}
            >
              {uploading ? 'Đang tải lên...' : 'Tải lên hình ảnh'}
            </Button>
          </label>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {images.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
          >
            <CloudUpload sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có hình ảnh nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tải lên hình ảnh đầu tiên cho homestay của bạn
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-first-button"
              multiple
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-first-button">
              <Button variant="contained" component="span" startIcon={<Add />}>
                Tải lên hình ảnh
              </Button>
            </label>
          </Box>
        ) : (
          <ImageList variant="masonry" cols={3} gap={16}>
            {images.map((image) => (
              <ImageListItem key={image.id}>
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                />
                <ImageListItemBar
                  title={image.name}
                  subtitle={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption">{image.size}</Typography>
                      {image.is_primary && (
                        <Chip label="Chính" size="small" color="primary" />
                      )}
                    </Box>
                  }
                  actionIcon={
                    <Box>
                      <Tooltip title="Xem">
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          onClick={() => setPreviewDialog({ open: true, image })}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={image.is_primary ? 'Đã là ảnh chính' : 'Đặt làm ảnh chính'}>
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          onClick={() => handleSetPrimary(image)}
                          disabled={image.is_primary}
                        >
                          {image.is_primary ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Xóa">
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          onClick={() => setDeleteDialog({ open: true, image })}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, image: null })}
      >
        <DialogTitle>Xác nhận xóa hình ảnh</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa hình ảnh "{deleteDialog.image?.name}"?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, image: null })}>
            Hủy
          </Button>
          <Button
            onClick={() => handleDeleteImage(deleteDialog.image)}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, image: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {previewDialog.image?.name}
          {previewDialog.image?.is_primary && (
            <Chip label="Ảnh chính" size="small" color="primary" sx={{ ml: 2 }} />
          )}
        </DialogTitle>
        <DialogContent>
          {previewDialog.image && (
            <img
              src={previewDialog.image.url}
              alt={previewDialog.image.name}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, image: null })}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomestayImages;