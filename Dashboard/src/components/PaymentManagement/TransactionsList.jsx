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
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Receipt,
  Download,
  Refresh,
  FilterList,
  AttachMoney,
  CreditCard,
  AccountBalance,
  TrendingUp,
} from '@mui/icons-material';

const TransactionsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data
  const transactions = [
    {
      id: 'TXN001',
      bookingId: 'BK001',
      customerName: 'Nguyễn Văn Nam',
      homestayName: 'Villa Sapa View',
      amount: 4800000,
      commission: 480000,
      hostAmount: 4320000,
      type: 'booking',
      method: 'vnpay',
      status: 'completed',
      date: '2024-01-15 14:30:25',
      transactionFee: 48000,
      description: 'Thanh toán đặt phòng Villa Sapa View',
    },
    {
      id: 'TXN002',
      bookingId: 'BK002',
      customerName: 'Trần Thị Lan',
      homestayName: 'Homestay Hội An',
      amount: 3200000,
      commission: 320000,
      hostAmount: 2880000,
      type: 'booking',
      method: 'momo',
      status: 'pending',
      date: '2024-01-12 09:15:10',
      transactionFee: 32000,
      description: 'Thanh toán đặt phòng Homestay Hội An',
    },
    {
      id: 'TXN003',
      bookingId: 'BK004',
      customerName: 'Phạm Thị Hoa',
      homestayName: 'Villa Đà Lạt',
      amount: 4400000,
      commission: 0,
      hostAmount: 0,
      type: 'refund',
      method: 'vnpay',
      status: 'completed',
      date: '2024-01-18 16:45:30',
      transactionFee: 0,
      description: 'Hoàn tiền do hủy booking',
    },
    {
      id: 'TXN004',
      bookingId: 'BK003',
      customerName: 'Lê Minh Tuấn',
      homestayName: 'Bungalow Phú Quốc',
      amount: 9000000,
      commission: 900000,
      hostAmount: 8100000,
      type: 'booking',
      method: 'bank_transfer',
      status: 'completed',
      date: '2024-01-08 11:20:15',
      transactionFee: 90000,
      description: 'Thanh toán đặt phòng Bungalow Phú Quốc',
    },
    {
      id: 'TXN005',
      bookingId: 'BK005',
      customerName: 'Hoàng Văn Đức',
      homestayName: 'Homestay Mekong',
      amount: 2400000,
      commission: 240000,
      hostAmount: 2160000,
      type: 'booking',
      method: 'vnpay',
      status: 'failed',
      date: '2024-01-14 13:10:45',
      transactionFee: 0,
      description: 'Thanh toán đặt phòng Homestay Mekong - Thất bại',
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleViewDetails = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking':
        return 'primary';
      case 'refund':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'booking':
        return 'Đặt phòng';
      case 'refund':
        return 'Hoàn tiền';
      default:
        return type;
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'vnpay':
        return 'VNPay';
      case 'momo':
        return 'MoMo';
      case 'bank_transfer':
        return 'Chuyển khoản';
      default:
        return method;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.homestayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = filteredTransactions.reduce((sum, t) => sum + t.commission, 0);
  const totalFees = filteredTransactions.reduce((sum, t) => sum + t.transactionFee, 0);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Danh sách giao dịch
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Download />} sx={{ mr: 1 }}>
            Xuất Excel
          </Button>
          <Button variant="contained" startIcon={<Refresh />}>
            Đồng bộ
          </Button>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo mã giao dịch, khách hàng hoặc homestay..."
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
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="pending">Đang xử lý</MenuItem>
              <MenuItem value="failed">Thất bại</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Loại giao dịch</InputLabel>
            <Select
              value={typeFilter}
              label="Loại giao dịch"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="booking">Đặt phòng</MenuItem>
              <MenuItem value="refund">Hoàn tiền</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng giao dịch
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {(totalAmount / 1000000000).toFixed(1)}B đ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Hoa hồng
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {(totalCommission / 1000000).toFixed(1)}M đ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard sx={{ color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Phí giao dịch
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {(totalFees / 1000).toFixed(0)}K đ
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Số giao dịch
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    {filteredTransactions.length}
                  </Typography>
                </Box>
              </Box>
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
                <TableCell>Mã giao dịch</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Homestay</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell align="right">Số tiền</TableCell>
                <TableCell align="right">Hoa hồng</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {transaction.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.bookingId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {transaction.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.homestayName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeText(transaction.type)}
                        color={getTypeColor(transaction.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getMethodText(transaction.method)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        color={transaction.type === 'refund' ? 'error.main' : 'success.main'}
                      >
                        {transaction.type === 'refund' ? '-' : ''}
                        {(transaction.amount / 1000000).toFixed(1)}M đ
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary.main">
                        {(transaction.commission / 1000).toFixed(0)}K đ
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(transaction.status)}
                        color={getStatusColor(transaction.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.date}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, transaction)}
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
          count={filteredTransactions.length}
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
          <Receipt sx={{ mr: 1 }} />
          Xem hóa đơn
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 1 }} />
          Tải xuống
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Refresh sx={{ mr: 1 }} />
          Đồng bộ lại
        </MenuItem>
      </Menu>

      {/* Transaction Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết giao dịch - {selectedTransaction?.id}
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Thông tin giao dịch
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã giao dịch: <strong>{selectedTransaction.id}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mã booking: <strong>{selectedTransaction.bookingId}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian: <strong>{selectedTransaction.date}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mô tả: <strong>{selectedTransaction.description}</strong>
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{selectedTransaction.customerName}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Homestay: {selectedTransaction.homestayName}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Chi tiết thanh toán
                </Typography>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tổng tiền:</Typography>
                    <Typography fontWeight={600} color="success.main">
                      {(selectedTransaction.amount / 1000000).toFixed(1)}M đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Hoa hồng (10%):</Typography>
                    <Typography fontWeight={600} color="primary.main">
                      {(selectedTransaction.commission / 1000).toFixed(0)}K đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Phí giao dịch:</Typography>
                    <Typography fontWeight={600} color="warning.main">
                      {(selectedTransaction.transactionFee / 1000).toFixed(0)}K đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Host nhận:</Typography>
                    <Typography fontWeight={600} color="info.main">
                      {(selectedTransaction.hostAmount / 1000000).toFixed(1)}M đ
                    </Typography>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Phương thức:</Typography>
                  <Chip
                    label={getMethodText(selectedTransaction.method)}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Loại giao dịch:</Typography>
                  <Chip
                    label={getTypeText(selectedTransaction.type)}
                    color={getTypeColor(selectedTransaction.type)}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">Trạng thái:</Typography>
                  <Chip
                    label={getStatusText(selectedTransaction.status)}
                    color={getStatusColor(selectedTransaction.status)}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Tải hóa đơn
          </Button>
          {selectedTransaction?.status === 'failed' && (
            <Button variant="contained" onClick={handleCloseDialog}>
              Thử lại
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsList;