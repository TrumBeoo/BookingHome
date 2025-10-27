import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  LocationOn,
  CalendarToday,
  AttachMoney,
  People,
  CheckCircle,
  Cancel,
  Pending,
  Email,
  Phone,
  Print,
} from '@mui/icons-material';

const BookingsList = ({ statusFilter = 'all' }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data
  const bookings = [
    {
      id: 'BK001',
      customerName: 'Nguyễn Văn Nam',
      customerEmail: 'nam.nguyen@email.com',
      customerPhone: '0901234567',
      homestayName: 'Villa Sapa View',
      homestayLocation: 'Sa Pa, Lào Cai',
      hostName: 'Nguyễn Thị Mai',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      nights: 2,
      guests: 4,
      totalAmount: 4800000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-10',
      specialRequests: 'Cần giường phụ cho trẻ em',
      commission: 480000,
    },
    {
      id: 'BK002',
      customerName: 'Trần Thị Lan',
      customerEmail: 'lan.tran@email.com',
      customerPhone: '0912345678',
      homestayName: 'Homestay Hội An',
      homestayLocation: 'Hội An, Quảng Nam',
      hostName: 'Trần Văn Hùng',
      checkIn: '2024-01-20',
      checkOut: '2024-01-22',
      nights: 2,
      guests: 2,
      totalAmount: 3200000,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: '2024-01-12',
      specialRequests: '',
      commission: 320000,
    },
    {
      id: 'BK003',
      customerName: 'Lê Minh Tuấn',
      customerEmail: 'tuan.le@email.com',
      customerPhone: '0923456789',
      homestayName: 'Bungalow Phú Quốc',
      homestayLocation: 'Phú Quốc, Kiên Giang',
      hostName: 'Lê Thị Hương',
      checkIn: '2024-01-25',
      checkOut: '2024-01-28',
      nights: 3,
      guests: 4,
      totalAmount: 9000000,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2024-01-08',
      specialRequests: 'Đón tại sân bay',
      commission: 900000,
    },
    {
      id: 'BK004',
      customerName: 'Phạm Thị Hoa',
      customerEmail: 'hoa.pham@email.com',
      customerPhone: '0934567890',
      homestayName: 'Villa Đà Lạt',
      homestayLocation: 'Đà Lạt, Lâm Đồng',
      hostName: 'Phạm Văn Đức',
      checkIn: '2024-01-18',
      checkOut: '2024-01-20',
      nights: 2,
      guests: 6,
      totalAmount: 4400000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      bookingDate: '2024-01-05',
      specialRequests: '',
      commission: 0,
      cancellationReason: 'Khách hàng hủy do thay đổi kế hoạch',
    },
    {
      id: 'BK005',
      customerName: 'Hoàng Văn Đức',
      customerEmail: 'duc.hoang@email.com',
      customerPhone: '0945678901',
      homestayName: 'Homestay Mekong',
      homestayLocation: 'Cần Thơ',
      hostName: 'Hoàng Thị Lan',
      checkIn: '2024-02-01',
      checkOut: '2024-02-03',
      nights: 2,
      guests: 3,
      totalAmount: 2400000,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: '2024-01-14',
      specialRequests: 'Tour thuyền miễn phí',
      commission: 240000,
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleViewDetails = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
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
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'cancelled':
        return <Cancel />;
      default:
        return null;
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.homestayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = (statusFilter === 'all' && localStatusFilter === 'all') || 
                         booking.status === statusFilter || 
                         booking.status === localStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalCommission = filteredBookings.reduce((sum, booking) => sum + booking.commission, 0);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {statusFilter === 'all' ? 'Tất cả đặt phòng' : 
           statusFilter === 'pending' ? 'Đặt phòng chờ xác nhận' :
           statusFilter === 'confirmed' ? 'Đặt phòng đã xác nhận' :
           statusFilter === 'cancelled' ? 'Đặt phòng đã hủy' : 'Danh sách đặt phòng'}
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Print />} sx={{ mr: 1 }}>
            Xuất báo cáo
          </Button>
          <Button variant="contained" startIcon={<Email />}>
            Gửi thông báo
          </Button>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên khách hàng, homestay hoặc mã booking..."
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
        {statusFilter === 'all' && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={localStatusFilter}
                label="Trạng thái"
                onChange={(e) => setLocalStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng booking
              </Typography>
              <Typography variant="h4">
                {filteredBookings.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Chờ xác nhận
              </Typography>
              <Typography variant="h4" color="warning.main">
                {filteredBookings.filter(b => b.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng doanh thu
              </Typography>
              <Typography variant="h4" color="success.main">
                {(totalRevenue / 1000000).toFixed(1)}M
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Hoa hồng
              </Typography>
              <Typography variant="h4" color="primary.main">
                {(totalCommission / 1000000).toFixed(1)}M
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã booking</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Homestay</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell align="center">Khách</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
                <TableCell align="center">Thanh toán</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {booking.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.bookingDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {booking.customerName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {booking.customerName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.customerPhone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {booking.homestayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.homestayLocation}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Host: {booking.hostName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {booking.checkIn} → {booking.checkOut}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.nights} đêm
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${booking.guests} người`}
                        size="small"
                        color="info"
                        variant="outlined"
                        icon={<People />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {(booking.totalAmount / 1000000).toFixed(1)}M đ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        HH: {(booking.commission / 1000).toFixed(0)}K
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getPaymentStatusText(booking.paymentStatus)}
                        color={getPaymentStatusColor(booking.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(booking.status)}
                        color={getStatusColor(booking.status)}
                        size="small"
                        icon={getStatusIcon(booking.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, booking)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
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
        <MenuItem onClick={handleMenuClose}>
          <CheckCircle sx={{ mr: 1 }} />
          Xác nhận booking
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1 }} />
          Gửi email khách hàng
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Print sx={{ mr: 1 }} />
          In voucher
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Cancel sx={{ mr: 1 }} />
          Hủy booking
        </MenuItem>
      </Menu>

      {/* Booking Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết đặt phòng - {selectedBooking?.id}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedBooking.customerName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">
                      {selectedBooking.customerEmail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">
                      {selectedBooking.customerPhone}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Thông tin homestay
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedBooking.homestayName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">
                      {selectedBooking.homestayLocation}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Host: {selectedBooking.hostName}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Chi tiết đặt phòng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <CalendarToday sx={{ color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Check-in
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedBooking.checkIn}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <CalendarToday sx={{ color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Check-out
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedBooking.checkOut}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="info.main">
                        {selectedBooking.nights}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Số đêm
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="warning.main">
                        {selectedBooking.guests}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Số khách
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin thanh toán
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Tổng tiền:</Typography>
                      <Typography fontWeight={600} color="success.main">
                        {(selectedBooking.totalAmount / 1000000).toFixed(1)}M đ
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Hoa hồng:</Typography>
                      <Typography fontWeight={600} color="primary.main">
                        {(selectedBooking.commission / 1000).toFixed(0)}K đ
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>Trạng thái:</Typography>
                      <Chip
                        label={getPaymentStatusText(selectedBooking.paymentStatus)}
                        color={getPaymentStatusColor(selectedBooking.paymentStatus)}
                        size="small"
                      />
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Trạng thái booking
                  </Typography>
                  <Chip
                    label={getStatusText(selectedBooking.status)}
                    color={getStatusColor(selectedBooking.status)}
                    icon={getStatusIcon(selectedBooking.status)}
                  />
                </Box>

                {selectedBooking.specialRequests && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Yêu cầu đặc biệt
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedBooking.specialRequests}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {selectedBooking.cancellationReason && (
                  <Box>
                    <Typography variant="subtitle2" color="error.main" gutterBottom>
                      Lý do hủy
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'error.50' }}>
                      <Typography variant="body2">
                        {selectedBooking.cancellationReason}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="outlined" onClick={handleCloseDialog}>
            In voucher
          </Button>
          {selectedBooking?.status === 'pending' && (
            <Button variant="contained" onClick={handleCloseDialog}>
              Xác nhận
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingsList;