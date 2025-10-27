import React, { useState, useEffect, useMemo } from 'react';
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
  TableSortLabel,
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
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  LinearProgress,
  Tooltip,
  Fab,
  Collapse,
  Stack,
  Badge,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Block,
  Delete,
  Visibility,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Cancel,
  FilterList,
  Add,
  Download,
  Upload,
  Refresh,
  PersonAdd,
  Star,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Home,
  ExpandMore,
  ExpandLess,
  Close,
  Send,
  AttachMoney,
  History,
  Assessment,
} from '@mui/icons-material';
import { useUsers, useUserStats } from '../../hooks/useUsers';
import AddCustomerDialog from './AddCustomerDialog';
import EditCustomerDialog from './EditCustomerDialog';
import CustomerAnalytics from './CustomerAnalytics';

const CustomersList = () => {
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openAnalytics, setOpenAnalytics] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    recipients: 'selected', // 'selected', 'all', 'filtered'
  });

  // Use real data from API
  const {
    users: customers,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    sendBulkEmail,
  } = useUsers({ role: 'customer' });

  const { stats, loading: statsLoading } = useUserStats();

  // Fetch data with filters
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const filters = {
        page,
        limit: rowsPerPage,
        search: searchTerm,
        role: 'customer',
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate;
        switch (dateFilter) {
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = null;
        }
        if (startDate) {
          filters.created_after = startDate.toISOString();
        }
      }

      if (bookingFilter !== 'all') {
        switch (bookingFilter) {
          case 'no_bookings':
            filters.max_bookings = 0;
            break;
          case 'low_bookings':
            filters.max_bookings = 3;
            break;
          case 'high_bookings':
            filters.min_bookings = 10;
            break;
        }
      }

      fetchUsers(filters);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, page, rowsPerPage, sortBy, sortOrder, statusFilter, dateFilter, bookingFilter, fetchUsers]);

  // Event handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuClick = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleViewDetails = () => {
    setOpenDialog(true);
    setDialogTab(0);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
    setDialogTab(0);
  };

  const handleBlockUser = async () => {
    if (!selectedCustomer) return;
    
    try {
      const newStatus = selectedCustomer.status === 'blocked' ? 'active' : 'blocked';
      await updateUserStatus(selectedCustomer.id, newStatus);
      showSnackbar(
        `Đã ${newStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản ${selectedCustomer.full_name || selectedCustomer.name}`,
        'success'
      );
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi cập nhật trạng thái tài khoản', 'error');
    }
    handleMenuClose();
  };

  const handleDeleteUser = async () => {
    if (!selectedCustomer) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${selectedCustomer.full_name || selectedCustomer.name}?`)) {
      try {
        await deleteUser(selectedCustomer.id);
        showSnackbar('Đã xóa tài khoản thành công', 'success');
      } catch (error) {
        showSnackbar('Có lỗi xảy ra khi xóa tài khoản', 'error');
      }
    }
    handleMenuClose();
  };

  const handleEditUser = () => {
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditSubmit = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      showSnackbar('Đã cập nhật thông tin khách hàng thành công', 'success');
      setOpenEditDialog(false);
      setSelectedCustomer(null);
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi cập nhật thông tin', 'error');
    }
  };

  const handleAddCustomer = async (customerData) => {
    try {
      // TODO: Implement add customer API call
      console.log('Adding customer:', customerData);
      showSnackbar('Đã thêm khách hàng thành công', 'success');
      setOpenAddDialog(false);
      // Refresh the list
      handleRefresh();
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi thêm khách hàng', 'error');
    }
  };

  const handleSendEmail = () => {
    setEmailForm({
      ...emailForm,
      recipients: 'selected',
    });
    setOpenEmailDialog(true);
    handleMenuClose();
  };

  const handleSendBulkEmail = () => {
    setEmailForm({
      ...emailForm,
      recipients: 'all',
    });
    setOpenEmailDialog(true);
  };

  const handleEmailSubmit = async () => {
    try {
      let recipientIds = [];
      
      switch (emailForm.recipients) {
        case 'selected':
          recipientIds = [selectedCustomer.id];
          break;
        case 'all':
          recipientIds = customers.map(c => c.id);
          break;
        case 'filtered':
          // Use current filtered customers
          recipientIds = customers.map(c => c.id);
          break;
      }

      await sendBulkEmail(recipientIds, {
        subject: emailForm.subject,
        message: emailForm.message,
      });
      
      showSnackbar('Đã gửi email thành công', 'success');
      setOpenEmailDialog(false);
      setEmailForm({ subject: '', message: '', recipients: 'selected' });
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi gửi email', 'error');
    }
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    showSnackbar('Chức năng xuất dữ liệu đang được phát triển', 'info');
  };

  const handleRefresh = () => {
    fetchUsers({
      page,
      limit: rowsPerPage,
      search: searchTerm,
      role: 'customer',
      sort_by: sortBy,
      sort_order: sortOrder,
    });
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'blocked':
        return 'error';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'blocked':
        return 'Bị khóa';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  // Memoized filtered customers (for client-side operations)
  const filteredCustomers = useMemo(() => {
    return customers; // Server-side filtering is handled in useEffect
  }, [customers]);

  // Show loading state
  if (loading && customers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error && customers.length === 0) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Có lỗi xảy ra khi tải dữ liệu: {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Danh sách khách hàng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin và hoạt động của khách hàng
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={() => setOpenAnalytics(true)}
          >
            Thống kê
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportData}
          >
            Xuất dữ liệu
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={() => setOpenAddDialog(true)}
          >
            Thêm khách hàng
          </Button>
          <Button
            variant="contained"
            startIcon={<Email />}
            onClick={handleSendBulkEmail}
            disabled={customers.length === 0}
          >
            Gửi email hàng loạt
          </Button>
        </Stack>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Tổng khách hàng
                  </Typography>
                  <Typography variant="h4">
                    {statsLoading ? <CircularProgress size={24} /> : (stats?.total_customers || pagination.total)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonAdd />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Đang hoạt động
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {statsLoading ? <CircularProgress size={24} /> : (stats?.active_customers || customers.filter(c => c.status === 'active').length)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Bị khóa
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {statsLoading ? <CircularProgress size={24} /> : (stats?.blocked_customers || customers.filter(c => c.status === 'blocked').length)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Block />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Tổng chi tiêu
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {statsLoading ? <CircularProgress size={24} /> : (
                      formatCurrency(stats?.total_customer_spending || customers.reduce((sum, c) => sum + (c.total_spent || 0), 0))
                    )}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm khách hàng theo tên, email hoặc số điện thoại..."
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
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                size="small"
              >
                Bộ lọc
              </Button>
              {(statusFilter !== 'all' || dateFilter !== 'all' || bookingFilter !== 'all') && (
                <Chip
                  label="Đang lọc"
                  color="primary"
                  size="small"
                  onDelete={() => {
                    setStatusFilter('all');
                    setDateFilter('all');
                    setBookingFilter('all');
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Collapse in={showFilters}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="blocked">Bị khóa</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Thời gian đăng ký</InputLabel>
                <Select
                  value={dateFilter}
                  label="Thời gian đăng ký"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="7days">7 ngày gần nhất</MenuItem>
                  <MenuItem value="30days">30 ngày gần nhất</MenuItem>
                  <MenuItem value="90days">90 ngày gần nhất</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Số lượt đặt phòng</InputLabel>
                <Select
                  value={bookingFilter}
                  label="Số lượt đặt phòng"
                  onChange={(e) => setBookingFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="no_bookings">Chưa đặt phòng</MenuItem>
                  <MenuItem value="low_bookings">1-3 lần</MenuItem>
                  <MenuItem value="high_bookings">Trên 10 lần</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'full_name'}
                    direction={sortBy === 'full_name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('full_name')}
                  >
                    Khách hàng
                  </TableSortLabel>
                </TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'created_at'}
                    direction={sortBy === 'created_at' ? sortOrder : 'asc'}
                    onClick={() => handleSort('created_at')}
                  >
                    Ngày tham gia
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortBy === 'total_bookings'}
                    direction={sortBy === 'total_bookings' ? sortOrder : 'asc'}
                    onClick={() => handleSort('total_bookings')}
                  >
                    Số đặt phòng
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortBy === 'total_spent'}
                    direction={sortBy === 'total_spent' ? sortOrder : 'asc'}
                    onClick={() => handleSort('total_spent')}
                  >
                    Tổng chi tiêu
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không có dữ liệu khách hàng
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            customer.status === 'active' ? (
                              <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                            ) : customer.status === 'blocked' ? (
                              <Block sx={{ color: 'error.main', fontSize: 16 }} />
                            ) : null
                          }
                        >
                          <Avatar 
                            sx={{ mr: 2 }}
                            src={customer.avatar_url}
                          >
                            {(customer.full_name || customer.name || customer.email).charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {customer.full_name || customer.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {customer.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Email sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {customer.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {customer.phone || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {customer.location || customer.address || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString('vi-VN') : customer.joinDate || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={customer.total_bookings || customer.totalBookings || 0}
                        size="small"
                        color={
                          (customer.total_bookings || customer.totalBookings || 0) > 10 ? 'success' :
                          (customer.total_bookings || customer.totalBookings || 0) > 3 ? 'primary' : 'default'
                        }
                        variant="outlined"
                        icon={<ShoppingCart />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatCurrency(customer.total_spent || customer.totalSpent || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(customer.status)}
                        color={getStatusColor(customer.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, customer)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEditUser}>
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleSendEmail}>
          <Email sx={{ mr: 1 }} />
          Gửi email
        </MenuItem>
        <MenuItem onClick={handleBlockUser}>
          {selectedCustomer?.status === 'blocked' ? (
            <>
              <CheckCircle sx={{ mr: 1 }} />
              Mở khóa tài khoản
            </>
          ) : (
            <>
              <Block sx={{ mr: 1 }} />
              Khóa tài khoản
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa tài khoản
        </MenuItem>
      </Menu>

      {/* Customer Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Chi tiết khách hàng</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              <Tabs value={dialogTab} onChange={(e, newValue) => setDialogTab(newValue)}>
                <Tab label="Thông tin cá nhân" />
                <Tab label="Lịch sử đặt phòng" />
                <Tab label="Đánh giá & Phản hồi" />
                <Tab label="Thống kê hành vi" />
              </Tabs>

              {/* Tab 0: Personal Information */}
              {dialogTab === 0 && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar
                          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                          src={selectedCustomer.avatar_url}
                        >
                          {(selectedCustomer.full_name || selectedCustomer.name || selectedCustomer.email).charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6">
                          {selectedCustomer.full_name || selectedCustomer.name || 'N/A'}
                        </Typography>
                        <Chip
                          label={getStatusText(selectedCustomer.status)}
                          color={getStatusColor(selectedCustomer.status)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Email
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography>{selectedCustomer.email}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Số điện thoại
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography>{selectedCustomer.phone || 'N/A'}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Địa chỉ
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography>{selectedCustomer.location || selectedCustomer.address || 'N/A'}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Ngày tham gia
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography>
                                {selectedCustomer.created_at 
                                  ? new Date(selectedCustomer.created_at).toLocaleDateString('vi-VN')
                                  : selectedCustomer.joinDate || 'N/A'
                                }
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Giới tính
                            </Typography>
                            <Typography>{selectedCustomer.gender || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab 1: Booking History */}
              {dialogTab === 1 && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            {selectedCustomer.total_bookings || selectedCustomer.totalBookings || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tổng số đặt phòng
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="success.main" gutterBottom>
                            {selectedCustomer.completed_bookings || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Đặt phòng hoàn thành
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="error.main" gutterBottom>
                            {selectedCustomer.cancelled_bookings || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Đặt phòng bị hủy
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Lịch sử đặt phòng gần đây
                  </Typography>
                  <List>
                    {/* Mock booking history - replace with real data */}
                    <ListItem>
                      <ListItemIcon>
                        <Home />
                      </ListItemIcon>
                      <ListItemText
                        primary="Villa Sunset Beach"
                        secondary="15/11/2024 - 18/11/2024 • Hoàn thành • 2,500,000 VNĐ"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Home />
                      </ListItemIcon>
                      <ListItemText
                        primary="Cozy Mountain Cabin"
                        secondary="01/10/2024 - 03/10/2024 • Hoàn thành • 1,800,000 VNĐ"
                      />
                    </ListItem>
                  </List>
                </Box>
              )}

              {/* Tab 2: Reviews & Feedback */}
              {dialogTab === 2 && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Đánh giá trung bình
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" sx={{ mr: 1 }}>
                              {selectedCustomer.average_rating || 4.5}
                            </Typography>
                            <Rating value={selectedCustomer.average_rating || 4.5} readOnly precision={0.1} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Từ {selectedCustomer.total_reviews || 12} đánh giá
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Phản hồi gần đây
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Đánh giá gần nhất: {selectedCustomer.last_review_date || '15/11/2024'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Đánh giá gần đây
                  </Typography>
                  <List>
                    {/* Mock reviews - replace with real data */}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={5} readOnly size="small" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              15/11/2024
                            </Typography>
                          </Box>
                        }
                        secondary="Homestay rất đẹp và sạch sẽ. Chủ nhà thân thiện và hỗ trợ tốt. Sẽ quay lại lần sau!"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={4} readOnly size="small" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              01/10/2024
                            </Typography>
                          </Box>
                        }
                        secondary="Vị trí tốt, view đẹp. Tuy nhiên wifi hơi chậm."
                      />
                    </ListItem>
                  </List>
                </Box>
              )}

              {/* Tab 3: Behavior Statistics */}
              {dialogTab === 3 && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Tổng chi tiêu
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            {formatCurrency(selectedCustomer.total_spent || selectedCustomer.totalSpent || 0)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
                            <Typography variant="body2" color="success.main">
                              +15% so với tháng trước
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Chi tiêu trung bình/đặt phòng
                          </Typography>
                          <Typography variant="h4" color="primary.main">
                            {formatCurrency(
                              (selectedCustomer.total_spent || selectedCustomer.totalSpent || 0) / 
                              Math.max(1, selectedCustomer.total_bookings || selectedCustomer.totalBookings || 1)
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Tần suất đặt phòng
                          </Typography>
                          <Typography variant="body1">
                            {selectedCustomer.booking_frequency || 'Trung bình 1 lần/tháng'}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={75} 
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Loại homestay ưa thích
                          </Typography>
                          <Typography variant="body1">
                            {selectedCustomer.preferred_type || 'Villa, Biệt thự'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="contained" onClick={handleEditUser}>
            Chỉnh sửa thông tin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Gửi email
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Người nhận</InputLabel>
                <Select
                  value={emailForm.recipients}
                  label="Người nhận"
                  onChange={(e) => setEmailForm({ ...emailForm, recipients: e.target.value })}
                >
                  <MenuItem value="selected">Khách hàng được chọn</MenuItem>
                  <MenuItem value="all">Tất cả khách hàng</MenuItem>
                  <MenuItem value="filtered">Khách hàng đã lọc</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung"
                multiline
                rows={6}
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleEmailSubmit}
            disabled={!emailForm.subject || !emailForm.message}
            startIcon={<Send />}
          >
            Gửi email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Dialog */}
      <AddCustomerDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddCustomer}
        loading={loading}
      />

      {/* Edit Customer Dialog */}
      <EditCustomerDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSubmit={handleEditSubmit}
        loading={loading}
      />

      {/* Analytics Dialog */}
      <Dialog open={openAnalytics} onClose={() => setOpenAnalytics(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Thống kê & Phân tích khách hàng</Typography>
            <IconButton onClick={() => setOpenAnalytics(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CustomerAnalytics />
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomersList;