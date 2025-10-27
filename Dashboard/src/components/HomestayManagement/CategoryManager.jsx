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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Category
} from '@mui/icons-material';
import ApiService from '../../services/api';

const CategoryManager = ({ homestay, onUpdate, showSnackbar }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [selectedCategoryId, setSelectedCategoryId] = useState(homestay?.category_id || '');

  useEffect(() => {
    loadCategories();
    setSelectedCategoryId(homestay?.category_id || '');
  }, [homestay]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getCategories();
      setCategories(response.categories || response || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      showSnackbar('Không thể tải danh sách danh mục', 'error');
      // Fallback data
      setCategories([
        { id: 1, name: 'Homestay cao cấp', slug: 'homestay-cao-cap' },
        { id: 2, name: 'Homestay giá rẻ', slug: 'homestay-gia-re' },
        { id: 3, name: 'Homestay gần biển', slug: 'homestay-gan-bien' },
        { id: 4, name: 'Homestay gần núi', slug: 'homestay-gan-nui' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      showSnackbar('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    const categoryData = {
      ...newCategory,
      slug: newCategory.slug || generateSlug(newCategory.name)
    };

    setLoading(true);
    try {
      await ApiService.createCategory(categoryData);
      showSnackbar('Thêm danh mục thành công');
      setNewCategory({ name: '', slug: '' });
      setOpenDialog(false);
      loadCategories();
    } catch (error) {
      showSnackbar('Không thể thêm danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.name.trim()) {
      showSnackbar('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    const categoryData = {
      ...editingCategory,
      slug: editingCategory.slug || generateSlug(editingCategory.name)
    };

    setLoading(true);
    try {
      await ApiService.updateCategory(editingCategory.id, categoryData);
      showSnackbar('Cập nhật danh mục thành công');
      setEditingCategory(null);
      setOpenDialog(false);
      loadCategories();
    } catch (error) {
      showSnackbar('Không thể cập nhật danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    setLoading(true);
    try {
      await ApiService.deleteCategory(categoryId);
      showSnackbar('Xóa danh mục thành công');
      loadCategories();
    } catch (error) {
      showSnackbar('Không thể xóa danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHomestayCategory = async (categoryId) => {
    setLoading(true);
    try {
      await ApiService.updateHomestay(homestay.id, { category_id: categoryId });
      showSnackbar('Cập nhật danh mục homestay thành công');
      setSelectedCategoryId(categoryId);
      onUpdate();
    } catch (error) {
      showSnackbar('Không thể cập nhật danh mục homestay', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === selectedCategoryId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Quản lý danh mục cho: {homestay.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setNewCategory({ name: '', slug: '' });
            setEditingCategory(null);
            setOpenDialog(true);
          }}
        >
          Thêm danh mục mới
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
                  Danh mục hiện tại
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {getCurrentCategory() ? (
                    <Chip
                      label={getCurrentCategory().name}
                      color="primary"
                      size="large"
                      icon={<Category />}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có danh mục
                    </Typography>
                  )}
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Chọn danh mục</InputLabel>
                  <Select
                    value={selectedCategoryId}
                    label="Chọn danh mục"
                    onChange={(e) => handleUpdateHomestayCategory(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Không có danh mục</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tất cả danh mục
                </Typography>
                <List>
                  {categories.map((category) => (
                    <ListItem key={category.id}>
                      <ListItemText
                        primary={category.name}
                        secondary={`Slug: ${category.slug}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingCategory({ ...category });
                            setOpenDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {categories.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="Chưa có danh mục nào"
                        secondary="Thêm danh mục mới để bắt đầu"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên danh mục"
            fullWidth
            variant="outlined"
            value={editingCategory ? editingCategory.name : newCategory.name}
            onChange={(e) => {
              const value = e.target.value;
              if (editingCategory) {
                setEditingCategory({ 
                  ...editingCategory, 
                  name: value,
                  slug: generateSlug(value)
                });
              } else {
                setNewCategory({ 
                  ...newCategory, 
                  name: value,
                  slug: generateSlug(value)
                });
              }
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Slug (URL thân thiện)"
            fullWidth
            variant="outlined"
            value={editingCategory ? editingCategory.slug : newCategory.slug}
            onChange={(e) => {
              if (editingCategory) {
                setEditingCategory({ ...editingCategory, slug: e.target.value });
              } else {
                setNewCategory({ ...newCategory, slug: e.target.value });
              }
            }}
            helperText="Slug sẽ được tự động tạo từ tên danh mục nếu để trống"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Cancel />}>
            Hủy
          </Button>
          <Button
            onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingCategory ? 'Cập nhật' : 'Thêm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManager;