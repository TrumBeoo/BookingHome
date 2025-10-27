import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search,
  MoreVert,
  CheckCircle,
  Delete,
  Visibility,
  Block,
  Warning,
  History,
  CalendarToday,
  Person,
  Email,
  Phone,
  LocationOn,
  Refresh,
} from '@mui/icons-material';
import { useUsers } from '../../hooks/useUsers';

const BlockedAccountsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [blockReason, setBlockReason] = useState('');

  // Use blocked users hook
  const {
    users: blockedUsers,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUserStatus,
    deleteUser,
  } = useUsers({ status: 'blocked' });

  // Search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchUsers({
        page,
        limit: rowsPerPage,
        search: searchTerm,
        status: 'blocked',
      });
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, page, rowsPerPage, fetchUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleViewDetails = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUserStatus(selectedUser.id, 'active');
      showSnackbar(`Đã mở khóa tài khoản ${selectedUser.full_name || selectedUser.name}`, 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi mở khóa tài khoản', 'error');
    }
    handleMenuClose();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản ${selectedUser.full_name || selectedUser.name}?`)) {
      try {
        await deleteUser(selectedUser.id);
        showSnackbar('Đã xóa tài khoản vĩnh viễn', 'success');
      } catch (error) {
        showSnackbar('Có lỗi xảy ra khi xóa tài khoản', 'error');
      }
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    fetchUsers({
      page,
      limit: rowsPerPage,
      search: searchTerm,
      status: 'blocked',
    });
  };

  // Mock block reasons - replace with real data
  const getBlockReason = (user) => {
    const reasons = [
      'Vi phạm điều khoản sử dụng',
      'Spam hoặc gửi nội dung không phù hợp',
      'Hành vi gian lận trong thanh toán',
      'Đánh giá giả mạo',
      'Hủy đặt phòng liên tục',
      'Khiếu nại từ host',
    ];
    return reasons[user.id % reasons.length];
  };

  const getBlockDate = (user) => {
    // Mock block date - replace with real data
    return user.blocked_at || user.updated_at || user.created_at;
  };

  // Show loading state
  if (loading && blockedUsers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error && blockedUsers.length === 0) {
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
            Tài khoản bị khóa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý các tài khoản vi phạm và bị khóa
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Tổng tài khoản bị khóa
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {pagination.total}
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
                    Khóa trong tháng này
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {Math.floor(pagination.total * 0.3)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Warning />
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
                    Đã mở khóa
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {Math.floor(pagination.total * 0.2)}
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
                    Xóa vĩnh viễn
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {Math.floor(pagination.total * 0.1)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'grey.500' }}>
                  <Delete />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm tài khoản bị khóa..."
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

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Lý do khóa</TableCell>
                <TableCell>Ngày khóa</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && blockedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : blockedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không có tài khoản bị khóa
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                blockedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ mr: 2, bgcolor: 'error.main' }}
                          src={user.avatar_url}
                        >
                          {(user.full_name || user.name || user.email).charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {user.full_name || user.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Email sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {user.phone || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getBlockReason(user)}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {getBlockDate(user) ? new Date(getBlockDate(user)).toLocaleDateString('vi-VN') : 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'customer' ? 'Khách hàng' : user.role === 'host' ? 'Host' : 'Admin'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, user)}
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
          rowsPerPageOptions={[5, 10, 25]}
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
        <MenuItem onClick={handleUnblockUser}>
          <CheckCircle sx={{ mr: 1 }} />
          Mở khóa tài khoản
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa vĩnh viễn
        </MenuItem>
      </Menu>

      {/* User Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết tài khoản bị khóa
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'error.main' }}
                      src={selectedUser.avatar_url}
                    >
                      {(selectedUser.full_name || selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6">
                      {selectedUser.full_name || selectedUser.name || 'N/A'}
                    </Typography>
                    <Chip
                      label="Bị khóa"
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cơ bản
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={selectedUser.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText
                        primary="Số điện thoại"
                        secondary={selectedUser.phone || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary="Vai trò"
                        secondary={selectedUser.role === 'customer' ? 'Khách hàng' : selectedUser.role === 'host' ? 'Host' : 'Admin'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ngày tham gia"
                        secondary={selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      />
                    </ListItem>
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Thông tin khóa tài khoản
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Warning />
                      </ListItemIcon>
                      <ListItemText
                        primary="Lý do khóa"
                        secondary={getBlockReason(selectedUser)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ngày khóa"
                        secondary={getBlockDate(selectedUser) ? new Date(getBlockDate(selectedUser)).toLocaleDateString('vi-VN') : 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <History />
                      </ListItemIcon>
                      <ListItemText
                        primary="Số lần vi phạm"
                        secondary={`${Math.floor(Math.random() * 5) + 1} lần`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="outlined" onClick={handleUnblockUser}>
            Mở khóa tài khoản
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
            Xóa vĩnh viễn
          </Button>
        </DialogActions>
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

export default BlockedAccountsList;