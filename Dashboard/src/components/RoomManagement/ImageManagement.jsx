import React, { useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Grid, Card, CardMedia, CardActions, IconButton,
  Typography, LinearProgress, Alert, Fab, Tooltip
} from '@mui/material';
import {
  CloudUpload, Delete, Close, PhotoLibrary, Add
} from '@mui/icons-material';
import { roomCategoriesAPI } from '../../services/roomCategoriesAPI';

const ImageManagement = ({ open, onClose, category, onImagesUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Một số file không hợp lệ. Chỉ chấp nhận file ảnh dưới 5MB.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await roomCategoriesAPI.uploadCategoryImages(category.id, validFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(`Đã tải lên ${validFiles.length} hình ảnh thành công!`);
      
      // Reset file input
      event.target.value = '';
      
      // Notify parent component
      if (onImagesUpdated) {
        onImagesUpdated();
      }
    } catch (err) {
      setError('Không thể tải lên hình ảnh. Vui lòng thử lại.');
      console.error('Error uploading images:', err);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setSuccess('');
      }, 2000);
    }
  };

  const handleDeleteImage = async (imageIndex) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    try {
      await roomCategoriesAPI.deleteCategoryImage(category.id, imageIndex);
      setSuccess('Đã xóa hình ảnh thành công!');
      
      if (onImagesUpdated) {
        onImagesUpdated();
      }
    } catch (err) {
      setError('Không thể xóa hình ảnh. Vui lòng thử lại.');
      console.error('Error deleting image:', err);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoLibrary />
            <Typography variant="h6">
              Quản lý hình ảnh - {category.name}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Upload Section */}
        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleFileSelect}
            disabled={uploading}
            size="large"
            fullWidth
            sx={{ mb: 2 }}
          >
            {uploading ? 'Đang tải lên...' : 'Chọn hình ảnh để tải lên'}
          </Button>
          
          {uploading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Đang tải lên... {uploadProgress}%
              </Typography>
            </Box>
          )}
          
          <Typography variant="body2" color="text.secondary">
            Chấp nhận file: JPG, PNG, GIF. Kích thước tối đa: 5MB mỗi file.
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Images Grid */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Hình ảnh hiện có ({category.images?.length || 0})
          </Typography>
          
          {category.images && category.images.length > 0 ? (
            <Grid container spacing={2}>
              {category.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image.id || index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={typeof image === 'string' ? `http://localhost:8000${image}` : (image.url ? `http://localhost:8000${image.url}` : image)}
                      alt={`${category.name} - ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                      onLoad={() => console.log('Image loaded:', image)}
                      onError={(e) => {
                        console.error('Image load error:', image);
                        console.error('Full URL:', e.target.src);
                      }}
                    />
                    <CardActions>
                      <Tooltip title="Xóa hình ảnh">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteImage(index)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                        #{index + 1}
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                bgcolor: 'grey.50'
              }}
            >
              <PhotoLibrary sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có hình ảnh nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tải lên hình ảnh để hiển thị loại phòng này
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleFileSelect}
                disabled={uploading}
              >
                Thêm hình ảnh đầu tiên
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} size="large">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageManagement;