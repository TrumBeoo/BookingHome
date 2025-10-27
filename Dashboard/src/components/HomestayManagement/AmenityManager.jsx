import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Settings
} from '@mui/icons-material';
import ApiService from '../../services/api';

const AmenityManager = ({ homestay, onUpdate, showSnackbar }) => {
  const [amenities, setAmenities] = useState([]);
  const [homestayAmenities, setHomestayAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [newAmenity, setNewAmenity] = useState({ name: '', icon: '' });

  useEffect(() => {
    loadAmenities();
    loadHomestayAmenities();
  }, [homestay]);

  const loadAmenities = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAmenities();
      setAmenities(response.amenities || response || []);
    } catch (error) {
      console.error('Error loading amenities:', error);
      showSnackbar('Không thể tải danh sách tiện ích', 'error');
      // Fallback data
      setAmenities([
        { id: 1, name: 'WiFi miễn phí', icon: '📶' },
        { id: 2, name: 'Hồ bơi', icon: '🏊' },
        { id: 3, name: 'Bếp', icon: '🍳' },
        { id: 4, name: 'Chỗ đậu xe', icon: '🚗' },
        { id: 5, name: 'Điều hòa', icon: '❄️' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadHomestayAmenities = async () => {
    try {
      const response = await ApiService.getHomestayAmenities(homestay.id);
      setHomestayAmenities(response.amenities || response || []);
    } catch (error) {
      console.error('Error loading homestay amenities:', error);
      setHomestayAmenities([]);
    }
  };

  const handleAddAmenity = async () => {
    if (!newAmenity.name.trim()) {
      showSnackbar('Vui lòng nhập tên tiện ích', 'error');
      return;
    }

    setLoading(true);
    try {
      await ApiService.createAmenity(newAmenity);
      showSnackbar('Thêm tiện ích thành công');
      setNewAmenity({ name: '', icon: '' });
      setOpenDialog(false);
      loadAmenities();
    } catch (error) {
      showSnackbar('Không thể thêm tiện ích', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAmenity = async () => {
    if (!editingAmenity.name.trim()) {
      showSnackbar('Vui lòng nhập tên tiện ích', 'error');
      return;
    }

    setLoading(true);
    try {
      await ApiService.updateAmenity(editingAmenity.id, editingAmenity);
      showSnackbar('Cập nhật tiện ích thành công');
      setEditingAmenity(null);
      setOpenDialog(false);
      loadAmenities();
    } catch (error) {
      showSnackbar('Không thể cập nhật tiện ích', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAmenity = async (amenityId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tiện ích này?')) return;

    setLoading(true);
    try {
      await ApiService.deleteAmenity(amenityId);
      showSnackbar('Xóa tiện ích thành công');
      loadAmenities();
    } catch (error) {
      showSnackbar('Không thể xóa tiện ích', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHomestayAmenity = async (amenityId, isSelected) => {
    setLoading(true);
    try {
      if (isSelected) {
        await ApiService.addHomestayAmenity(homestay.id, amenityId);
        showSnackbar('Đã thêm tiện ích cho homestay');
      } else {
        await ApiService.removeHomestayAmenity(homestay.id, amenityId);
        showSnackbar('Đã xóa tiện ích khỏi homestay');
      }
      loadHomestayAmenities();
      onUpdate();
    } catch (error) {
      showSnackbar('Không thể cập nhật tiện ích homestay', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isAmenitySelected = (amenityId) => {
    return homestayAmenities.some(ha => ha.id === amenityId || ha.amenity_id === amenityId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Quản lý tiện ích cho: {homestay.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setNewAmenity({ name: '', icon: '' });
            setEditingAmenity(null);
            setOpenDialog(true);
          }}
        >
          Thêm tiện ích mới
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tất cả tiện ích
                </Typography>
                <List>
                  {amenities.map((amenity) => (
                    <ListItem key={amenity.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isAmenitySelected(amenity.id)}
                            onChange={(e) => handleToggleHomestayAmenity(amenity.id, e.target.checked)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1">
                              {amenity.icon} {amenity.name}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingAmenity({ ...amenity });
                            setOpenDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteAmenity(amenity.id)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tiện ích đã chọn
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {homestayAmenities.map((amenity) => (
                    <Chip
                      key={amenity.id}
                      label={`${amenity.icon || ''} ${amenity.name}`}
                      onDelete={() => handleToggleHomestayAmenity(amenity.id, false)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {homestayAmenities.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có tiện ích nào được chọn
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Amenity Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAmenity ? 'Chỉnh sửa tiện ích' : 'Thêm tiện ích mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên tiện ích"
            fullWidth
            variant="outlined"
            value={editingAmenity ? editingAmenity.name : newAmenity.name}
            onChange={(e) => {
              if (editingAmenity) {
                setEditingAmenity({ ...editingAmenity, name: e.target.value });
              } else {
                setNewAmenity({ ...newAmenity, name: e.target.value });
              }
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Icon (emoji hoặc text)"
            fullWidth
            variant="outlined"
            value={editingAmenity ? editingAmenity.icon : newAmenity.icon}
            onChange={(e) => {
              if (editingAmenity) {
                setEditingAmenity({ ...editingAmenity, icon: e.target.value });
              } else {
                setNewAmenity({ ...newAmenity, icon: e.target.value });
              }
            }}
            placeholder="🏊 hoặc Pool"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Cancel />}>
            Hủy
          </Button>
          <Button
            onClick={editingAmenity ? handleUpdateAmenity : handleAddAmenity}
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingAmenity ? 'Cập nhật' : 'Thêm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AmenityManager;