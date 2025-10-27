import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Fade,
  Slide,
  Snackbar,
  Alert,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Category,
  Visibility,
  VisibilityOff,
  Home,
  Apartment,
  Villa,
  Cottage,
  Hotel,
  ColorLens,
} from '@mui/icons-material';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Home',
    color: '#1976d2',
    status: 'active',
    order: 0,
  });

  // Mock data
  const mockCategories = [
    {
      id: 1,
      name: 'Villa',
      description: 'Biệt thự cao cấp với không gian rộng rãi',
      icon: 'Villa',
      color: '#1976d2',
      status: 'active',
      order: 1,
      homestayCount: 45,
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'Homestay',
      description: 'Nhà ở gia đình ấm cúng, gần gũi',
      icon: 'Home',
      color: '#2e7d32',
      status: 'active',
      order: 2,
      homestayCount: 78,
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      name: 'Apartment',
      description: 'Căn hộ hiện đại trong thành phố',
      icon: 'Apartment',
      color: '#ed6c02',
      status: 'active',
      order: 3,
      homestayCount: 23,
      createdAt: '2024-01-03',
    },
    {
      id: 4,
      name: 'Cottage',
      description: 'Nhà gỗ nhỏ xinh giữa thiên nhiên',
      icon: 'Cottage',
      color: '#9c27b0',
      status: 'inactive',
      order: 4,
      homestayCount: 12,
      createdAt: '2024-01-04',
    },
  ];

  const iconOptions = [
    { value: 'Home', label: 'Nhà', icon: Home },
    { value: 'Villa', label: 'Villa', icon: Villa },
    { value: 'Apartment', label: 'Căn hộ', icon: Apartment },
    { value: 'Cottage', label: 'Nhà gỗ', icon: Cottage },
    { value: 'Hotel', label: 'Khách sạn', icon: Hotel },
  ];

  const colorOptions = [
    '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f',
    '#0288d1', '#388e3c', '#f57c00', '#7b1fa2', '#c62828',
  ];

  useEffect(() => {
    setCategories(mockCategories);
  }, []);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        status: category.status,
        order: category.order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: 'Home',
        color: '#1976d2',
        status: 'active',
        order: categories.length + 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Home',
      color: '#1976d2',
      status: 'active',
      order: 0,
    });
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, updatedAt: new Date().toISOString() }
          : cat
      ));
      setSnackbar({
        open: true,
        message: 'Danh mục đã được cập nhật thành công!',
        severity: 'success'
      });
    } else {
      // Create new category
      const newCategory = {
        id: Date.now(),
        ...formData,
        homestayCount: 0,
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
      setSnackbar({
        open: true,
        message: 'Danh mục mới đã được tạo thành công!',
        severity: 'success'
      });
    }
    handleCloseDialog();
  };

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleToggleStatus = (category) => {
    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    setCategories(categories.map(cat => 
      cat.id === category.id 
        ? { ...cat, status: newStatus }
        : cat
    ));
    setSnackbar({
      open: true,
      message: `Danh mục đã được ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'}!`,
      severity: 'success'
    });
    handleMenuClose();
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      setCategories(categories.filter(cat => cat.id !== category.id));
      setSnackbar({
        open: true,
        message: 'Danh mục đã được xóa thành công!',
        severity: 'success'
      });
    }
    handleMenuClose();
  };

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : Home;
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Slide direction="down" in timeout={600}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Quản lý Danh mục
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quản lý các danh mục homestay của bạn
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                }
              }}
            >
              Thêm Danh mục
            </Button>
          </Box>
        </Slide>

        {/* Categories Grid */}
        <Slide direction="up" in timeout={800}>
          <Grid container spacing={3}>
            {categories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                      },
                      border: category.status === 'inactive' ? '2px dashed #ccc' : 'none',
                      opacity: category.status === 'inactive' ? 0.7 : 1,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: category.color,
                            width: 56,
                            height: 56,
                          }}
                        >
                          <IconComponent />
                        </Avatar>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, category)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {category.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {category.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Homestays:
                        </Typography>
                        <Chip
                          label={category.homestayCount}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Trạng thái:
                        </Typography>
                        <Chip
                          label={category.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          color={category.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(category)}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        size="small"
                        startIcon={category.status === 'active' ? <VisibilityOff /> : <Visibility />}
                        onClick={() => handleToggleStatus(category)}
                        color={category.status === 'active' ? 'warning' : 'success'}
                      >
                        {category.status === 'active' ? 'Ẩn' : 'Hiện'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Slide>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleOpenDialog(selectedCategory)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Chỉnh sửa</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleToggleStatus(selectedCategory)}>
            <ListItemIcon>
              {selectedCategory?.status === 'active' ? 
                <VisibilityOff fontSize="small" /> : 
                <Visibility fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText>
              {selectedCategory?.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={() => handleDeleteCategory(selectedCategory)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Xóa danh mục</ListItemText>
          </MenuItem>
        </Menu>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên danh mục"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Icon</InputLabel>
                  <Select
                    value={formData.icon}
                    label="Icon"
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconComponent sx={{ mr: 1 }} />
                            {option.label}
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={formData.status}
                    label="Trạng thái"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="inactive">Không hoạt động</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Màu sắc
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {colorOptions.map((color) => (
                    <Tooltip key={color} title={color}>
                      <IconButton
                        onClick={() => setFormData({ ...formData, color })}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: color,
                          border: formData.color === color ? '3px solid #000' : '1px solid #ccc',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        {formData.color === color && <ColorLens sx={{ color: 'white', fontSize: 20 }} />}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thứ tự hiển thị"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveCategory}
              disabled={!formData.name.trim()}
            >
              {editingCategory ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default CategoryManagement;