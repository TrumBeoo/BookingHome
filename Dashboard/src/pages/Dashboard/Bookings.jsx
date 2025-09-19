import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  Cancel,
  Visibility,
  Email,
  Phone,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Bookings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const bookings = [
    {
      id: 'BK001',
      customer: {
        name: 'Nguyễn Văn Nam',
        email: 'nam.nguyen@example.com',
        phone: '0987654321',
        avatar: 'N',
      },
      property: 'Villa Sapa View',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      nights: 2,
      guests: 4,
      amount: 2400000,
      commission: 240000,
      status: 'pending',
      createdAt: '2024-01-10',
      paymentStatus: 'pending',
      specialRequests: 'Phòng tầng cao, view đẹp',
    },
    {
      id: 'BK002',
      customer: {
        name: 'Trần Thị Lan',
        email: 'lan.tran@example.com',
        phone: '0976543210',
        avatar: 'L',
      },
      property: 'Homestay Hội An',
      checkIn: '2024-01-20',
      checkOut: '2024-01-22',
      nights: 2,
      guests: 2,
      amount: 1600000,
      commission: 160000,
      status: 'confirmed',
      createdAt: '2024-01-12',
      paymentStatus: 'paid',
      specialRequests: '',
    },
    {
      id: 'BK003',
      customer: {
        name: 'Lê Minh Tuấn',
        email: 'tuan.le@example.com',
        phone: '0965432109',
        avatar: 'T',
      },
      property: 'Bungalow Phú Quốc',
      checkIn: '2024-01-25',
      checkOut: '2024-01-27',
      nights: 2,
      guests: 6,
      amount: 3000000,
      commission: 300000,
      status: 'cancelled',
      createdAt: '2024-01-08',
      paymentStatus: 'refunded',
      specialRequests: 'Cần xe đưa đón sân bay',
    },
  ];

  const tabs = [
    { label: 'Tất cả', value: 'all', count: bookings.length },
    { label: 'Chờ xác nhận', value: 'pending', count: bookings.filter(b => b.status === 'pending').length },
    { label: 'Đã xác nhận', value: 'confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { label: 'Đã hủy', value: 'cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const handleActionConfirm = () => {
    console.log(`${actionType} booking:`, selectedBooking?.id);
    setActionDialogOpen(false);
    setSelectedBooking(null);
    setActionType('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Mã DP',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'Khách hàng',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
            {params.value.avatar}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.value.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.value.phone}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'property',
      headerName: 'Homestay',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'checkIn',
      headerName: 'Nhận phòng',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString('vi-VN')}
        </Typography>
      ),
    },
    {
      field: 'checkOut',
      headerName: 'Trả phòng',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString('vi-VN')}
        </Typography>
      ),
    },
    {
      field: 'nights',
      headerName: 'Số đêm',
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Tổng tiền',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
          {(params.value / 1000000).toFixed(1)}M
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusText(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Thanh toán',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={getPaymentStatusText(params.value)}
          color={getPaymentStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => handleMenuOpen(e, params.row)}
          size="small"
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = tabValue === 0 || booking.status === tabs[tabValue].value;
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout title="Quản lý Đặt phòng">
      <Box>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Danh sách Đặt phòng
        </Typography>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ px: 2, pt: 1 }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    <Chip size="small" label={tab.count} />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên, homestay, mã DP..."
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
                  <InputLabel>Trạng thái thanh toán</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Trạng thái thanh toán"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="paid">Đã thanh toán</MenuItem>
                    <MenuItem value="pending">Chờ thanh toán</MenuItem>
                    <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                    fullWidth
                >
                  Bộ lọc nâng cao
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Bookings DataGrid */}
        <Card>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredBookings}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Visibility sx={{ mr: 2 }} />
            Xem chi tiết
          </MenuItem>
          {selectedBooking?.status === 'pending' && (
            <>
              <MenuItem onClick={() => handleActionClick('confirm')}>
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                Xác nhận
              </MenuItem>
              <MenuItem onClick={() => handleActionClick('cancel')}>
                <Cancel sx={{ mr: 2, color: 'error.main' }} />
                Từ chối
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleMenuClose}>
            <Email sx={{ mr: 2 }} />
            Gửi email
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Phone sx={{ mr: 2 }} />
            Gọi điện
          </MenuItem>
        </Menu>

        {/* Action Confirmation Dialog */}
        <Dialog
          open={actionDialogOpen}
          onClose={() => setActionDialogOpen(false)}
        >
          <DialogTitle>
            {actionType === 'confirm' ? 'Xác nhận đặt phòng' : 'Từ chối đặt phòng'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn {actionType === 'confirm' ? 'xác nhận' : 'từ chối'} 
              đặt phòng "{selectedBooking?.id}"?
            </Typography>
            {actionType === 'cancel' && (
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Lý do từ chối (tùy chọn)"
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleActionConfirm}
              color={actionType === 'confirm' ? 'success' : 'error'}
              variant="contained"
            >
              {actionType === 'confirm' ? 'Xác nhận' : 'Từ chối'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Bookings;