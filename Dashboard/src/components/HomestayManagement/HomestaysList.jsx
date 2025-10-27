import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import { handleApiError, getStatusColor, getStatusText, formatPrice } from '../../utils/errorHandler';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Rating,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Tooltip,
  Fade,
  Slide,
  CircularProgress,
  Backdrop,
  Divider,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  LocationOn,
  CalendarToday,
  Star,
  AttachMoney,
  People,
  FilterList,
  Add,
  PhotoLibrary,
  StarBorder,
  Schedule,
  TrendingUp,
  Warning,
  CheckCircle,
  Cancel,
  Refresh,
  GetApp,
} from '@mui/icons-material';

const HomestaysList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalHomestays, setTotalHomestays] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkActions, setBulkActions] = useState({ selected: [], action: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadHomestays();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const loadHomestays = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      
      const response = await ApiService.getHomestays(params);
      console.log('API Response:', response);
      
      if (response) {
        // Handle different response formats
        const homestaysData = response.homestays || response.data || (Array.isArray(response) ? response : []);
        const total = response.total || response.count || homestaysData.length;
        
        setHomestays(homestaysData);
        setTotalHomestays(total);
      } else {
        setHomestays([]);
        setTotalHomestays(0);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Không thể tải danh sách homestay');
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      // Keep existing homestays or use empty array
      // No fallback - show error only
      setHomestays([]);
      setTotalHomestays(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHomestay = () => {
    navigate('/dashboard/homestays/create');
  };

  const handleEditHomestay = (homestay) => {
    if (!homestay || !homestay.id) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }
    navigate(`/dashboard/homestays/edit/${homestay.id}`);
    handleMenuClose();
  };

  const handleDeleteHomestay = (homestay) => {
    setConfirmDialog({
      open: true,
      title: 'Xác nhận xóa homestay',
      message: `Bạn có chắc chắn muốn xóa homestay "${homestay.name}"? Hành động này không thể hoàn tác.`,
      onConfirm: () => confirmDeleteHomestay(homestay)
    });
    handleMenuClose();
  };

  const confirmDeleteHomestay = async (homestay) => {
    if (!homestay) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }

    setActionLoading(true);
    try {
      // Try API call first
      try {
        await ApiService.deleteHomestay(homestay.id);
        setSnackbar({
          open: true,
          message: 'Homestay đã được xóa thành công!',
          severity: 'success'
        });
        loadHomestays();
      } catch (apiError) {
        throw apiError;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Có lỗi xảy ra khi xóa homestay');
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
    }
  };

  const handleToggleFeatured = async (homestay) => {
    if (!homestay) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }

    setActionLoading(true);
    try {
      // Try API call first
      try {
        await ApiService.updateHomestay(homestay.id, { featured: !homestay.featured });
        setSnackbar({
          open: true,
          message: `Homestay đã được ${!homestay.featured ? 'đặt nổi bật' : 'bỏ nổi bật'}!`,
          severity: 'success'
        });
        loadHomestays();
      } catch (apiError) {
        throw apiError;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Có lỗi xảy ra khi cập nhật trạng thái nổi bật');
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setActionLoading(false);
    }
    handleMenuClose();
  };

  const handleManageImages = (homestay) => {
    if (!homestay || !homestay.id) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }
    navigate(`/dashboard/homestays/${homestay.id}/images`);
    handleMenuClose();
  };

  const handleManageCalendar = (homestay) => {
    if (!homestay || !homestay.id) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }
    navigate(`/dashboard/homestays/${homestay.id}/calendar`);
    handleMenuClose();
  };

  const handleViewBookings = (homestay) => {
    if (!homestay || !homestay.id) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }
    navigate(`/dashboard/bookings?homestay=${homestay.id}`);
    handleMenuClose();
  };

  // No mock data - use real API only

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, homestay) => {
    setAnchorEl(event.currentTarget);
    setSelectedHomestay(homestay);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHomestay(null);
  };

  const handleViewDetails = () => {
    if (!selectedHomestay) {
      setSnackbar({
        open: true,
        message: 'Không tìm thấy thông tin homestay',
        severity: 'error'
      });
      return;
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHomestay(null);
  };

  const filteredHomestays = homestays.filter(homestay => {
    const matchesSearch = (homestay.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (homestay.address || homestay.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (homestay.host_name || homestay.hostName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || homestay.status === statusFilter;
    
    // Advanced filters
    const matchesFeatured = !bulkActions.featured || bulkActions.featured === 'all' || 
                           (bulkActions.featured === 'true' && homestay.featured) ||
                           (bulkActions.featured === 'false' && !homestay.featured);
    
    const price = homestay.price_per_night || homestay.price || 0;
    const matchesMinPrice = !bulkActions.minPrice || price >= parseInt(bulkActions.minPrice);
    const matchesMaxPrice = !bulkActions.maxPrice || price <= parseInt(bulkActions.maxPrice);
    
    return matchesSearch && matchesStatus && matchesFeatured && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <Fade in timeout={800}>
      <Box>
        <Slide direction="down" in timeout={600}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Danh sách Homestay
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Refresh />} 
                onClick={loadHomestays}
                disabled={loading}
              >
                Làm mới
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<GetApp />} 
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Tên,Địa điểm,Giá,Trạng thái\n" +
                    filteredHomestays.map(h => 
                      `"${h.name}","${h.address || h.location}","${h.price_per_night || h.price}","${getStatusText(h.status)}"`
                    ).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "homestays.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Xuất CSV
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={handleAddHomestay}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                  }
                }}
              >
                Thêm Homestay mới
              </Button>
            </Box>
          </Box>
        </Slide>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm homestay theo tên, địa điểm hoặc host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ height: '56px' }}
          >
            Bộ lọc
          </Button>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      {showFilters && (
        <Slide direction="down" in={showFilters} timeout={300}>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Bộ lọc nâng cao
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Nổi bật</InputLabel>
                  <Select
                    value={bulkActions.featured || 'all'}
                    label="Nổi bật"
                    onChange={(e) => setBulkActions(prev => ({ ...prev, featured: e.target.value }))}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="true">Nổi bật</MenuItem>
                    <MenuItem value="false">Không nổi bật</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Giá tối thiểu (VNĐ)"
                  type="number"
                  value={bulkActions.minPrice || ''}
                  onChange={(e) => setBulkActions(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Giá tối đa (VNĐ)"
                  type="number"
                  value={bulkActions.maxPrice || ''}
                  onChange={(e) => setBulkActions(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setBulkActions({ selected: [], action: '' })}
                  sx={{ height: '56px' }}
                >
                  Xóa bộ lọc
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Slide>
      )}

        {/* Statistics Cards */}
        <Slide direction="up" in timeout={800}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tổng Homestay
                      </Typography>
                      <Typography variant="h4">
                        {filteredHomestays.length}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                      <TrendingUp />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Đang hoạt động
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {filteredHomestays.filter(h => h.status === 'active').length}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                      <CheckCircle />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tỷ lệ lấp đầy TB
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {filteredHomestays.length > 0 ? Math.round(filteredHomestays.reduce((sum, h) => sum + (h.occupancyRate || 0), 0) / filteredHomestays.length) : 0}%
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                      <Star />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tổng doanh thu
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {filteredHomestays.length > 0 ? (filteredHomestays.reduce((sum, h) => sum + (h.revenue || 0), 0) / 1000000000).toFixed(1) : '0.0'}B
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                      <AttachMoney />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Slide>

        {/* Table */}
        <Slide direction="up" in timeout={1000}>
          <Paper sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <TableContainer>
              <Table>
            <TableHead>
              <TableRow>
                <TableCell>Homestay</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell align="center">Giá/đêm</TableCell>
                <TableCell align="center">Sức chứa</TableCell>
                <TableCell align="center">Đánh giá</TableCell>
                <TableCell align="center">Lấp đầy</TableCell>
                <TableCell align="right">Doanh thu</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Đang tải dữ liệu...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredHomestays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy homestay nào
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thử thay đổi bộ lọc hoặc thêm homestay mới
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHomestays
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((homestay) => (
                  <TableRow 
                    key={homestay.id} 
                    hover
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'scale(1.01)',
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          variant="rounded"
                          sx={{ 
                            mr: 2, 
                            width: 56, 
                            height: 56,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            }
                          }}
                          src={homestay.images && homestay.images[0] ? homestay.images[0] : '/images/placeholder.jpg'}
                        >
                          <PhotoLibrary />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {homestay.name}
                            {homestay.featured && (
                              <Star sx={{ ml: 1, color: 'warning.main', fontSize: 16 }} />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {homestay.bedrooms || 'N/A'} phòng ngủ • {homestay.bathrooms || 'N/A'} phòng tắm
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {homestay.host_name || homestay.hostName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {homestay.address || homestay.location || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {((homestay.price_per_night || homestay.price || 0) / 1000).toFixed(0)}K
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${homestay.max_guests || homestay.capacity || 0} người`}
                        size="small"
                        color="info"
                        variant="outlined"
                        icon={<People />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Rating value={homestay.avg_rating || homestay.rating || 0} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({homestay.review_count || homestay.totalReviews || 0})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={(homestay.occupancyRate || 0) > 70 ? 'success.main' : 
                               (homestay.occupancyRate || 0) > 50 ? 'warning.main' : 'error.main'}
                      >
                        {homestay.occupancyRate || 0}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {((homestay.revenue || 0) / 1000000).toFixed(1)}M đ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {homestay.totalBookings || 0} booking
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(homestay.status)}
                        color={getStatusColor(homestay.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Thao tác">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, homestay)}
                          sx={{
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              transform: 'rotate(90deg)',
                            }
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredHomestays.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
          </Paper>
        </Slide>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          }
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem chi tiết</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleEditHomestay(selectedHomestay)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleManageImages(selectedHomestay)}>
          <ListItemIcon>
            <PhotoLibrary fontSize="small" />
          </ListItemIcon>
          <ListItemText>Quản lý hình ảnh</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleManageCalendar(selectedHomestay)}>
          <ListItemIcon>
            <CalendarToday fontSize="small" />
          </ListItemIcon>
          <ListItemText>Quản lý lịch</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleViewBookings(selectedHomestay)}>
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem booking</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleToggleFeatured(selectedHomestay)}
          disabled={actionLoading}
        >
          <ListItemIcon>
            {actionLoading ? <CircularProgress size={16} /> : 
             (selectedHomestay?.featured ? <StarBorder fontSize="small" /> : <Star fontSize="small" />)}
          </ListItemIcon>
          <ListItemText>
            {selectedHomestay?.featured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
          </ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleDeleteHomestay(selectedHomestay)} 
          sx={{ color: 'error.main' }}
          disabled={actionLoading}
        >
          <ListItemIcon>
            {actionLoading ? <CircularProgress size={16} color="error" /> : 
             <Delete fontSize="small" sx={{ color: 'error.main' }} />}
          </ListItemIcon>
          <ListItemText>Xóa homestay</ListItemText>
        </MenuItem>
      </Menu>

      {/* Homestay Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Chi tiết Homestay
        </DialogTitle>
        <DialogContent>
          {selectedHomestay && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={(selectedHomestay.images && selectedHomestay.images[0]) || '/images/placeholder.jpg'}
                    alt={selectedHomestay.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedHomestay.name}
                      {selectedHomestay.featured && (
                        <Star sx={{ ml: 1, color: 'warning.main' }} />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography color="text.secondary">
                        {selectedHomestay.address || selectedHomestay.location || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={selectedHomestay.avg_rating || selectedHomestay.rating || 0} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {selectedHomestay.avg_rating || selectedHomestay.rating || 0} ({selectedHomestay.review_count || selectedHomestay.totalReviews || 0} đánh giá)
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(selectedHomestay.status)}
                      color={getStatusColor(selectedHomestay.status)}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {((selectedHomestay.price_per_night || selectedHomestay.price || 0) / 1000).toFixed(0)}K
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          VNĐ/đêm
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          {selectedHomestay.max_guests || selectedHomestay.capacity || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Người
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          {selectedHomestay.bedrooms || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phòng ngủ
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="warning.main">
                          {selectedHomestay.bathrooms || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phòng tắm
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thống kê kinh doanh
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          {((selectedHomestay.revenue || 0) / 1000000).toFixed(1)}M
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Doanh thu (VNĐ)
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          {selectedHomestay.totalBookings || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tổng booking
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography
                          variant="h6"
                          color={(selectedHomestay.occupancyRate || 0) > 70 ? 'success.main' : 
                                 (selectedHomestay.occupancyRate || 0) > 50 ? 'warning.main' : 'error.main'}
                        >
                          {selectedHomestay.occupancyRate || 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tỷ lệ lấp đầy
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tiện ích
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(selectedHomestay.amenities || []).map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thông tin Host
                  </Typography>
                  <Typography variant="body1">
                    <strong>Host:</strong> {selectedHomestay.host_name || selectedHomestay.hostName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tạo ngày: {selectedHomestay.createdDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booking gần nhất: {selectedHomestay.lastBooking}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              handleEditHomestay(selectedHomestay);
              handleCloseDialog();
            }}
          >
            Chỉnh sửa
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              handleViewBookings(selectedHomestay);
              handleCloseDialog();
            }}
          >
            Xem booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: 'warning.main' }} />
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
          >
            Hủy
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDialog.onConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={actionLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Box>
    </Fade>
  );
};

export default HomestaysList;