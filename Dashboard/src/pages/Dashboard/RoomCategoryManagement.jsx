import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Checkbox, FormControlLabel, Alert, CircularProgress, Grid, Card, CardContent,
  CardActions, Tabs, Tab, Pagination, InputAdornment, Tooltip, Avatar,
  Divider, Stack, Badge, Switch, FormGroup, Accordion, AccordionSummary,
  AccordionDetails, Fab, Snackbar
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, Search, FilterList, PhotoLibrary,
  ExpandMore, Dashboard as DashboardIcon, Category, Tag, Settings,
  TrendingUp, People, Hotel, AttachMoney, Close, CloudUpload,
  CheckCircle, Cancel, Star, Favorite
} from '@mui/icons-material';
import { roomCategoriesAPI } from '../../services/roomCategoriesAPI';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ImageManagement from '../../components/RoomManagement/ImageManagement';
import './RoomCategoryManagement.css';

const RoomCategoryManagement = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  // UI State
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    view_type: '',
    has_balcony: null,
    has_kitchen: null,
    is_pet_friendly: null,
    price_range: [0, 10000000],
    tags: []
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    max_guests: 1,
    room_size: '',
    bed_type: '',
    view_type: '',
    has_balcony: false,
    has_kitchen: false,
    is_pet_friendly: false,
    amenities: [],
    selectedTags: [],
    images: []
  });
  
  // Tag form data
  const [tagFormData, setTagFormData] = useState({
    name: '',
    color: '#1976d2',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, [page, searchTerm, filterOptions]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: itemsPerPage,
        search: searchTerm,
        ...filterOptions
      };
      
      const [categoriesData, tagsData, statsData] = await Promise.all([
        roomCategoriesAPI.getCategories(params),
        roomCategoriesAPI.getTags(),
        roomCategoriesAPI.getStatistics().catch(() => ({}))
      ]);
      
      setCategories(categoriesData.results || categoriesData);
      setTotalPages(categoriesData.total_pages || 1);
      setTags(tagsData);
      setStatistics(statsData);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilterOptions(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        base_price: category.base_price || '',
        max_guests: category.max_guests,
        room_size: category.room_size || '',
        bed_type: category.bed_type || '',
        view_type: category.view_type || '',
        has_balcony: category.has_balcony,
        has_kitchen: category.has_kitchen,
        is_pet_friendly: category.is_pet_friendly,
        amenities: category.amenities || [],
        selectedTags: category.tags?.map(tag => tag.id) || [],
        images: category.images || []
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        base_price: '',
        max_guests: 1,
        room_size: '',
        bed_type: '',
        view_type: '',
        has_balcony: false,
        has_kitchen: false,
        is_pet_friendly: false,
        amenities: [],
        selectedTags: [],
        images: []
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        room_size: parseFloat(formData.room_size),
        tag_ids: formData.selectedTags
      };

      if (editingCategory) {
        await roomCategoriesAPI.updateCategory(editingCategory.id, submitData);
        setSuccess('Cập nhật loại phòng thành công!');
      } else {
        await roomCategoriesAPI.createCategory(submitData);
        setSuccess('Thêm loại phòng mới thành công!');
      }

      await loadData();
      handleCloseDialog();
    } catch (err) {
      setError('Không thể lưu dữ liệu. Vui lòng thử lại.');
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      try {
        await roomCategoriesAPI.deleteCategory(id);
        setSuccess('Xóa loại phòng thành công!');
        await loadData();
      } catch (err) {
        setError('Không thể xóa loại phòng. Vui lòng thử lại.');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleImageManagement = (category) => {
    setSelectedCategory(category);
    setImageDialogOpen(true);
  };

  const handleTagManagement = () => {
    setTagDialogOpen(true);
  };

  const handleCreateTag = async () => {
    try {
      await roomCategoriesAPI.createTag(tagFormData);
      setSuccess('Thêm tag mới thành công!');
      setTagFormData({ name: '', color: '#1976d2', description: '' });
      await loadData();
    } catch (err) {
      setError('Không thể tạo tag mới.');
      console.error('Error creating tag:', err);
    }
  };

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getFilteredCategories = () => {
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const commonAmenities = [
    'WiFi', 'Điều hòa', 'TV', 'Tủ lạnh', 'Máy giặt', 'Bồn tắm',
    'Vòi sen', 'Máy sấy tóc', 'Bàn làm việc', 'Tủ quần áo',
    'Ban công', 'Bếp riêng', 'Máy pha cà phê', 'Két sắt'
  ];

  const viewTypes = ['Biển', 'Núi', 'Thành phố', 'Vườn', 'Hồ bơi', 'Sân golf'];
  const bedTypes = ['Giường đơn', 'Giường đôi', 'Giường king', 'Giường queen', 'Giường tầng'];

  // Statistics Cards Component
  const StatisticsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="statistics-card">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Tổng loại phòng
                </Typography>
                <Typography variant="h4">
                  {statistics.total_categories || categories.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Hotel />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="statistics-card">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Giá trung bình
                </Typography>
                <Typography variant="h4">
                  {formatPrice(statistics.average_price || 0)}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <AttachMoney />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="statistics-card">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Phổ biến nhất
                </Typography>
                <Typography variant="h6">
                  {statistics.most_popular || 'N/A'}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <TrendingUp />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="statistics-card">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Tags
                </Typography>
                <Typography variant="h4">
                  {tags.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Tag />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Search and Filter Component
  const SearchAndFilter = () => (
    <Paper className="search-filter-section" sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm loại phòng..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>View</InputLabel>
            <Select
              value={filterOptions.view_type}
              onChange={(e) => handleFilterChange('view_type', e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {viewTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Ban công</InputLabel>
            <Select
              value={filterOptions.has_balcony || ''}
              onChange={(e) => handleFilterChange('has_balcony', e.target.value === '' ? null : e.target.value === 'true')}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Có</MenuItem>
              <MenuItem value="false">Không</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Bếp riêng</InputLabel>
            <Select
              value={filterOptions.has_kitchen || ''}
              onChange={(e) => handleFilterChange('has_kitchen', e.target.value === '' ? null : e.target.value === 'true')}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Có</MenuItem>
              <MenuItem value="false">Không</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterOptions({
              view_type: '',
              has_balcony: null,
              has_kitchen: null,
              is_pet_friendly: null,
              price_range: [0, 10000000],
              tags: []
            })}
          >
            Xóa bộ lọc
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  // Category Grid Component
  const CategoryGrid = () => (
    <Grid container spacing={3}>
      {getFilteredCategories().map((category) => (
        <Grid item xs={12} sm={6} md={4} key={category.id}>
          <Card className="category-card fade-in" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box className="category-image" sx={{ position: 'relative', height: 200, bgcolor: 'grey.100' }}>
              {category.images && category.images.length > 0 ? (
                <img
                  src={`http://localhost:8000${category.images[0]}`}
                  alt={category.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.log('Image load error:', category.images[0]);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {(!category.images || category.images.length === 0) && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: 'grey.500'
                }}>
                  <Hotel sx={{ fontSize: 60 }} />
                </Box>
              )}
              {/* Fallback cho khi ảnh lỗi */}
              <Box sx={{ 
                display: 'none',
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                color: 'grey.500',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'grey.100'
              }}>
                <Hotel sx={{ fontSize: 60 }} />
              </Box>
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Chip
                  className="price-chip"
                  label={formatPrice(category.base_price)}
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2">
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {category.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={`${category.max_guests} khách`} size="small" />
                <Chip label={`${category.room_size}m²`} size="small" />
                <Chip label={category.view_type} size="small" />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {category.has_balcony && <Chip label="Ban công" size="small" color="success" />}
                {category.has_kitchen && <Chip label="Bếp riêng" size="small" color="success" />}
                {category.is_pet_friendly && <Chip label="Thú cưng" size="small" color="success" />}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {category.tags?.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{ 
                      backgroundColor: tag.color + '20',
                      color: tag.color,
                      fontSize: '0.7rem'
                    }}
                  />
                ))}
                {category.tags?.length > 3 && (
                  <Chip
                    label={`+${category.tags.length - 3}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleOpenDialog(category)}>
                <Edit sx={{ mr: 1 }} /> Sửa
              </Button>
              <Button size="small" onClick={() => handleImageManagement(category)}>
                <PhotoLibrary sx={{ mr: 1 }} /> Hình ảnh
              </Button>
              <Button size="small" color="error" onClick={() => handleDelete(category.id)}>
                <Delete sx={{ mr: 1 }} /> Xóa
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading && categories.length === 0) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box className="room-category-management" sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Quản lý loại phòng
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Tag />}
              onClick={handleTagManagement}
            >
              Quản lý Tags
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Thêm loại phòng
            </Button>
          </Stack>
        </Box>

        {/* Tabs */}
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab icon={<DashboardIcon />} label="Tổng quan" />
          <Tab icon={<Category />} label="Danh sách loại phòng" />
        </Tabs>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Tab Content */}
        {currentTab === 0 && (
          <Box>
            <StatisticsCards />
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thống kê nhanh
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng quan về các loại phòng trong hệ thống
              </Typography>
            </Paper>
          </Box>
        )}

        {currentTab === 1 && (
          <Box>
            <SearchAndFilter />
            <CategoryGrid />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        )}

        {/* Dialogs */}
        
        {/* Category Form Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {editingCategory ? 'Sửa loại phòng' : 'Thêm loại phòng mới'}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Thông tin cơ bản</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Tên loại phòng"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Giá cơ bản (VND)"
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => handleInputChange('base_price', e.target.value)}
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Số khách tối đa"
                        type="number"
                        value={formData.max_guests}
                        onChange={(e) => handleInputChange('max_guests', parseInt(e.target.value))}
                        fullWidth
                        inputProps={{ min: 1, max: 20 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Diện tích (m²)"
                        type="number"
                        value={formData.room_size}
                        onChange={(e) => handleInputChange('room_size', e.target.value)}
                        fullWidth
                        InputProps={{
                          endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Loại giường</InputLabel>
                        <Select
                          value={formData.bed_type}
                          onChange={(e) => handleInputChange('bed_type', e.target.value)}
                        >
                          {bedTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Loại view</InputLabel>
                        <Select
                          value={formData.view_type}
                          onChange={(e) => handleInputChange('view_type', e.target.value)}
                        >
                          {viewTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Mô tả"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        fullWidth
                        placeholder="Mô tả chi tiết về loại phòng này..."
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Tính năng đặc biệt</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.has_balcony}
                          onChange={(e) => handleInputChange('has_balcony', e.target.checked)}
                        />
                      }
                      label="Có ban công"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.has_kitchen}
                          onChange={(e) => handleInputChange('has_kitchen', e.target.checked)}
                        />
                      }
                      label="Có bếp riêng"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_pet_friendly}
                          onChange={(e) => handleInputChange('is_pet_friendly', e.target.checked)}
                        />
                      }
                      label="Thân thiện với thú cưng"
                    />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Tiện nghi</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {commonAmenities.map(amenity => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        onClick={() => handleAmenityChange(amenity)}
                        color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                        variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                        clickable
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Tags</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tags.map(tag => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        onClick={() => {
                          const newTags = formData.selectedTags.includes(tag.id)
                            ? formData.selectedTags.filter(id => id !== tag.id)
                            : [...formData.selectedTags, tag.id];
                          handleInputChange('selectedTags', newTags);
                        }}
                        sx={{
                          backgroundColor: formData.selectedTags.includes(tag.id) ? tag.color : 'transparent',
                          borderColor: tag.color,
                          color: formData.selectedTags.includes(tag.id) ? 'white' : tag.color,
                          '&:hover': {
                            backgroundColor: formData.selectedTags.includes(tag.id) ? tag.color : tag.color + '20'
                          }
                        }}
                        variant={formData.selectedTags.includes(tag.id) ? 'filled' : 'outlined'}
                        clickable
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} size="large">
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              size="large"
              disabled={!formData.name || !formData.base_price}
            >
              {editingCategory ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tag Management Dialog */}
        <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Quản lý Tags</Typography>
              <IconButton onClick={() => setTagDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tạo tag mới
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Tên tag"
                    value={tagFormData.name}
                    onChange={(e) => setTagFormData(prev => ({ ...prev, name: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Màu sắc"
                    type="color"
                    value={tagFormData.color}
                    onChange={(e) => setTagFormData(prev => ({ ...prev, color: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mô tả"
                    value={tagFormData.description}
                    onChange={(e) => setTagFormData(prev => ({ ...prev, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleCreateTag}
                    disabled={!tagFormData.name}
                    fullWidth
                  >
                    Tạo Tag
                  </Button>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Tags hiện có
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map(tag => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    sx={{
                      backgroundColor: tag.color + '20',
                      color: tag.color,
                      borderColor: tag.color
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Image Management Dialog */}
        <ImageManagement
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          category={selectedCategory}
          onImagesUpdated={loadData}
        />

        {/* Success Snackbar */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default RoomCategoryManagement;