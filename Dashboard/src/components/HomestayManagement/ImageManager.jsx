import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Star,
  StarBorder,
  Edit,
  Save,
  Cancel,
  PhotoLibrary
} from '@mui/icons-material';
import ApiService from '../../services/api';

const ImageManager = ({ homestay, onUpdate, showSnackbar }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    loadImages();
  }, [homestay]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getHomestayImages(homestay.id);
      setImages(response.images || response || []);
    } catch (error) {
      console.error('Error loading images:', error);
      showSnackbar('Không thể tải danh sách hình ảnh', 'error');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      showSnackbar('Một số file không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP và tối đa 10MB.', 'warning');
    }

    setSelectedFiles(validFiles);
    if (validFiles.length > 0) {
      setOpenDialog(true);
    }
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      showSnackbar('Vui lòng chọn ít nhất một hình ảnh', 'error');
      return;
    }

    setUploading(true);
    try {
      await ApiService.uploadHomestayImages(homestay.id, selectedFiles);
      showSnackbar('Upload hình ảnh thành công');
      setSelectedFiles([]);
      setOpenDialog(false);
      loadImages();
      onUpdate();
    } catch (error) {
      showSnackbar('Không thể upload hình ảnh', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return;

    setLoading(true);
    try {
      await ApiService.deleteHomestayImage(imageId);
      showSnackbar('Xóa hình ảnh thành công');
      loadImages();
      onUpdate();
    } catch (error) {
      showSnackbar('Không thể xóa hình ảnh', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    setLoading(true);
    try {
      await ApiService.setPrimaryImage(homestay.id, imageId);
      showSnackbar('Đã đặt làm ảnh chính');
      loadImages();
      onUpdate();
    } catch (error) {
      showSnackbar('Không thể đặt ảnh chính', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImageInfo = async () => {
    if (!editingImage) return;

    setLoading(true);
    try {
      await ApiService.updateHomestayImage(editingImage.id, {
        alt_text: editingImage.alt_text,
        sort_order: editingImage.sort_order
      });
      showSnackbar('Cập nhật thông tin ảnh thành công');
      setEditingImage(null);
      loadImages();
    } catch (error) {
      showSnackbar('Không thể cập nhật thông tin ảnh', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/homestays/${imagePath}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Quản lý hình ảnh cho: {homestay.name}
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
        >
          Upload hình ảnh
          <input
            type="file"
            hidden
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
          />
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {images.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <PhotoLibrary sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chưa có hình ảnh nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload hình ảnh để hiển thị homestay của bạn
                </Typography>
              </Paper>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <ImageList variant="masonry" cols={4} gap={8}>
                {images.map((image) => (
                  <ImageListItem key={image.id}>
                    <img
                      src={getImageUrl(image.image_path)}
                      alt={image.alt_text || 'Homestay image'}
                      loading="lazy"
                      style={{ borderRadius: 8 }}
                    />
                    <ImageListItemBar
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {image.is_primary && (
                            <Chip label="Ảnh chính" size="small" color="primary" />
                          )}
                          <Typography variant="caption">
                            #{image.sort_order || 0}
                          </Typography>
                        </Box>
                      }
                      actionIcon={
                        <Box>
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            onClick={() => handleSetPrimaryImage(image.id)}
                            disabled={image.is_primary}
                          >
                            {image.is_primary ? <Star /> : <StarBorder />}
                          </IconButton>
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            onClick={() => setEditingImage({ ...image })}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}
        </Grid>
      )}

      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload hình ảnh mới</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Đã chọn {selectedFiles.length} file(s)
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {selectedFiles.map((file, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="120"
                    image={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" noWrap>
                      {file.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Cancel />}>
            Hủy
          </Button>
          <Button
            onClick={handleUploadImages}
            variant="contained"
            startIcon={<CloudUpload />}
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Image Dialog */}
      <Dialog 
        open={!!editingImage} 
        onClose={() => setEditingImage(null)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin ảnh</DialogTitle>
        <DialogContent>
          {editingImage && (
            <Box>
              <img
                src={getImageUrl(editingImage.image_path)}
                alt="Preview"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
              />
              <TextField
                fullWidth
                label="Mô tả ảnh (Alt text)"
                value={editingImage.alt_text || ''}
                onChange={(e) => setEditingImage({ ...editingImage, alt_text: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Thứ tự sắp xếp"
                type="number"
                value={editingImage.sort_order || 0}
                onChange={(e) => setEditingImage({ ...editingImage, sort_order: parseInt(e.target.value) })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingImage(null)} startIcon={<Cancel />}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateImageInfo}
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageManager;