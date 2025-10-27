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
  Rating,
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
  Home,
  Star,
  TrendingUp,
} from '@mui/icons-material';

const HostsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedHost, setSelectedHost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data
  const hosts = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      email: 'mai.nguyen@email.com',
      phone: '0901234567',
      location: 'Hà Nội',
      joinDate: '2023-01-15',
      totalProperties: 5,
      totalRevenue: 125000000,
      averageRating: 4.8,
      totalBookings: 156,
      status: 'active',
      avatar: null,
      lastActive: '2024-01-10',
      verificationStatus: 'verified',
    },
    {
      id: 2,
      name: 'Trần Văn Hùng',
      email: 'hung.tran@email.com',
      phone: '0912345678',
      location: 'TP.HCM',
      joinDate: '2023-03-22',
      totalProperties: 3,
      totalRevenue: 89000000,
      averageRating: 4.6,
      totalBookings: 98,
      status: 'active',
      avatar: null,
      lastActive: '2024-01-08',
      verificationStatus: 'verified',
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      email: 'huong.le@email.com',
      phone: '0923456789',
      location: 'Đà Nẵng',
      joinDate: '2023-05-10',
      totalProperties: 2,
      totalRevenue: 45000000,
      averageRating: 4.9,
      totalBookings: 67,
      status: 'pending',
      avatar: null,
      lastActive: '2024-01-05',
      verificationStatus: 'pending',
    },
    {
      id: 4,
      name: 'Phạm Văn Đức',
      email: 'duc.pham@email.com',
      phone: '0934567890',
      location: 'Hải Phòng',
      joinDate: '2023-07-18',
      totalProperties: 7,
      totalRevenue: 198000000,
      averageRating: 4.7,
      totalBookings: 234,
      status: 'active',
      avatar: null,
      lastActive: '2024-01-09',
      verificationStatus: 'verified',
    },
    {
      id: 5,
      name: 'Hoàng Thị Lan',
      email: 'lan.hoang@email.com',
      phone: '0945678901',
      location: 'Cần Thơ',
      joinDate: '2023-09-25',
      totalProperties: 1,
      totalRevenue: 12000000,
      averageRating: 4.2,
      totalBookings: 23,
      status: 'blocked',
      avatar: null,
      lastActive: '2023-12-15',
      verificationStatus: 'rejected',
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, host) => {
    setAnchorEl(event.currentTarget);
    setSelectedHost(host);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedHost(null);
  };

  const handleViewDetails = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHost(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'pending':
        return 'Chờ duyệt';
      case 'blocked':
        return 'Bị khóa';
      default:
        return status;
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getVerificationText = (status) => {
    switch (status) {
      case 'verified':
        return 'Đã xác minh';
      case 'pending':
        return 'Chờ xác minh';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.phone.includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Danh sách Host
        </Typography>
        <Button variant="contained" startIcon={<Email />}>
          Gửi thông báo hàng loạt
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm host theo tên, email hoặc số điện thoại..."
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
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng Host
              </Typography>
              <Typography variant="h4">
                {hosts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Đang hoạt động
              </Typography>
              <Typography variant="h4" color="success.main">
                {hosts.filter(h => h.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Chờ duyệt
              </Typography>
              <Typography variant="h4" color="warning.main">
                {hosts.filter(h => h.status === 'pending').length}
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
              <Typography variant="h4" color="primary.main">
                {(hosts.reduce((sum, h) => sum + h.totalRevenue, 0) / 1000000000).toFixed(1)}B
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
                <TableCell>Host</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell align="center">Homestay</TableCell>
                <TableCell align="center">Đánh giá</TableCell>
                <TableCell align="right">Doanh thu</TableCell>
                <TableCell align="center">Xác minh</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHosts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((host) => (
                  <TableRow key={host.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {host.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {host.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {host.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {host.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {host.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{host.location}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={host.totalProperties}
                        size="small"
                        color="primary"
                        variant="outlined"
                        icon={<Home />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Rating value={host.averageRating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({host.averageRating})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {(host.totalRevenue / 1000000).toFixed(1)}M đ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {host.totalBookings} booking
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getVerificationText(host.verificationStatus)}
                        color={getVerificationColor(host.verificationStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(host.status)}
                        color={getStatusColor(host.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, host)}
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
          count={filteredHosts.length}
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
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1 }} />
          Gửi email
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Star sx={{ mr: 1 }} />
          Xác minh tài khoản
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Block sx={{ mr: 1 }} />
          Khóa tài khoản
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa tài khoản
        </MenuItem>
      </Menu>

      {/* Host Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết Host
        </DialogTitle>
        <DialogContent>
          {selectedHost && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  >
                    {selectedHost.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedHost.name}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={getStatusText(selectedHost.status)}
                      color={getStatusColor(selectedHost.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={getVerificationText(selectedHost.verificationStatus)}
                      color={getVerificationColor(selectedHost.verificationStatus)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Thông tin liên hệ
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{selectedHost.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{selectedHost.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{selectedHost.location}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Thống kê kinh doanh
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {selectedHost.totalProperties}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Homestay
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          {(selectedHost.totalRevenue / 1000000).toFixed(1)}M đ
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Doanh thu
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          {selectedHost.totalBookings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tổng booking
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                          <Typography variant="h6" color="warning.main">
                            {selectedHost.averageRating}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Đánh giá TB
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Hoạt động
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      Hoạt động gần nhất: {selectedHost.lastActive}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      Tham gia từ: {selectedHost.joinDate}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HostsList;