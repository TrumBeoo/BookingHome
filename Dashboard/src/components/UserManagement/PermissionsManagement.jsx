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
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Visibility,
  Security,
  AdminPanelSettings,
  Person,
  Home,
  Assessment,
  Settings,
  Email,
  Phone,
  ExpandMore,
  Save,
  Close,
  Refresh,
} from '@mui/icons-material';
import { useUsers } from '../../hooks/useUsers';

const PermissionsManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [permissions, setPermissions] = useState({});

  // Use users hook
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
  } = useUsers({});

  // Default permissions structure
  const defaultPermissions = {
    dashboard: {
      view: false,
      manage: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      block: false,
    },
    homestays: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
    },
    bookings: {
      view: false,
      manage: false,
      cancel: false,
    },
    payments: {
      view: false,
      manage: false,
      refund: false,
    },
    reviews: {
      view: false,
      moderate: false,
      delete: false,
    },
    analytics: {
      view: false,
      export: false,
    },
    settings: {
      view: false,
      manage: false,
    },
  };

  // Role-based default permissions
  const rolePermissions = {
    admin: {
      dashboard: { view: true, manage: true },
      users: { view: true, create: true, edit: true, delete: true, block: true },
      homestays: { view: true, create: true, edit: true, delete: true, approve: true },
      bookings: { view: true, manage: true, cancel: true },
      payments: { view: true, manage: true, refund: true },
      reviews: { view: true, moderate: true, delete: true },
      analytics: { view: true, export: true },
      settings: { view: true, manage: true },
    },
    host: {
      dashboard: { view: true, manage: false },
      users: { view: false, create: false, edit: false, delete: false, block: false },
      homestays: { view: true, create: true, edit: true, delete: false, approve: false },
      bookings: { view: true, manage: true, cancel: false },
      payments: { view: true, manage: false, refund: false },
      reviews: { view: true, moderate: false, delete: false },
      analytics: { view: true, export: false },
      settings: { view: false, manage: false },
    },
    customer: {
      dashboard: { view: false, manage: false },
      users: { view: false, create: false, edit: false, delete: false, block: false },
      homestays: { view: true, create: false, edit: false, delete: false, approve: false },
      bookings: { view: true, manage: false, cancel: false },
      payments: { view: true, manage: false, refund: false },
      reviews: { view: true, moderate: false, delete: false },
      analytics: { view: false, export: false },
      settings: { view: false, manage: false },
    },
  };

  // Search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const filters = {
        page,
        limit: rowsPerPage,
        search: searchTerm,
      };

      if (roleFilter !== 'all') {
        filters.role = roleFilter;
      }

      fetchUsers(filters);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, page, rowsPerPage, roleFilter, fetchUsers]);

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

  const handleEditPermissions = () => {
    // Load user's current permissions or default based on role
    const userPermissions = selectedUser.permissions || rolePermissions[selectedUser.role] || defaultPermissions;
    setPermissions(userPermissions);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setPermissions({});
  };

  const handlePermissionChange = (module, permission) => (event) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: event.target.checked,
      },
    }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      showSnackbar('Đã cập nhật vai trò thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi cập nhật vai trò', 'error');
    }
  };

  const handleSavePermissions = async () => {
    try {
      await updateUser(selectedUser.id, { permissions });
      showSnackbar('Đã cập nhật quyền hạn thành công', 'success');
      setOpenDialog(false);
      setSelectedUser(null);
      setPermissions({});
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi cập nhật quyền hạn', 'error');
    }
  };

  const handleRefresh = () => {
    fetchUsers({
      page,
      limit: rowsPerPage,
      search: searchTerm,
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'host':
        return 'primary';
      case 'customer':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'host':
        return 'Host';
      case 'customer':
        return 'Khách hàng';
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings />;
      case 'host':
        return <Home />;
      case 'customer':
        return <Person />;
      default:
        return <Person />;
    }
  };

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error && users.length === 0) {
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
            Phân quyền người dùng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý vai trò và quyền hạn của người dùng trong hệ thống
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

      {/* Role Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Quản trị viên
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {users.filter(u => u.role === 'admin').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <AdminPanelSettings />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Host
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {users.filter(u => u.role === 'host').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Home />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Khách hàng
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {users.filter(u => u.role === 'customer').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Person />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm người dùng..."
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Lọc theo vai trò</InputLabel>
              <Select
                value={roleFilter}
                label="Lọc theo vai trò"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
                <MenuItem value="host">Host</MenuItem>
                <MenuItem value="customer">Khách hàng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Vai trò hiện tại</TableCell>
                <TableCell>Ngày tham gia</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không có dữ liệu người dùng
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ mr: 2 }}
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
                        icon={getRoleIcon(user.role)}
                        label={getRoleText(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status === 'active' ? 'Hoạt động' : user.status === 'blocked' ? 'Bị khóa' : 'Không hoạt động'}
                        color={user.status === 'active' ? 'success' : user.status === 'blocked' ? 'error' : 'warning'}
                        size="small"
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
        <MenuItem onClick={handleEditPermissions}>
          <Security sx={{ mr: 1 }} />
          Chỉnh sửa quyền hạn
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange(selectedUser?.id, 'admin')}>
          <AdminPanelSettings sx={{ mr: 1 }} />
          Đặt làm Admin
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange(selectedUser?.id, 'host')}>
          <Home sx={{ mr: 1 }} />
          Đặt làm Host
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange(selectedUser?.id, 'customer')}>
          <Person sx={{ mr: 1 }} />
          Đặt làm Khách hàng
        </MenuItem>
      </Menu>

      {/* Permissions Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Chỉnh sửa quyền hạn</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              {/* User Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Avatar sx={{ mr: 2 }} src={selectedUser.avatar_url}>
                  {(selectedUser.full_name || selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedUser.full_name || selectedUser.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email} • {getRoleText(selectedUser.role)}
                  </Typography>
                </Box>
              </Box>

              {/* Permissions */}
              <Typography variant="h6" gutterBottom>
                Quyền hạn chi tiết
              </Typography>
              
              {Object.entries(permissions).map(([module, modulePermissions]) => (
                <Accordion key={module} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      {module === 'dashboard' ? 'Bảng điều khiển' :
                       module === 'users' ? 'Người dùng' :
                       module === 'homestays' ? 'Homestay' :
                       module === 'bookings' ? 'Đặt phòng' :
                       module === 'payments' ? 'Thanh toán' :
                       module === 'reviews' ? 'Đánh giá' :
                       module === 'analytics' ? 'Thống kê' :
                       module === 'settings' ? 'Cài đặt' : module}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {Object.entries(modulePermissions).map(([permission, value]) => (
                        <Grid item xs={12} sm={6} key={permission}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value}
                                onChange={handlePermissionChange(module, permission)}
                              />
                            }
                            label={
                              permission === 'view' ? 'Xem' :
                              permission === 'create' ? 'Tạo mới' :
                              permission === 'edit' ? 'Chỉnh sửa' :
                              permission === 'delete' ? 'Xóa' :
                              permission === 'manage' ? 'Quản lý' :
                              permission === 'block' ? 'Khóa/Mở khóa' :
                              permission === 'approve' ? 'Phê duyệt' :
                              permission === 'cancel' ? 'Hủy' :
                              permission === 'refund' ? 'Hoàn tiền' :
                              permission === 'moderate' ? 'Kiểm duyệt' :
                              permission === 'export' ? 'Xuất dữ liệu' : permission
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleSavePermissions}
            startIcon={<Save />}
          >
            Lưu quyền hạn
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

export default PermissionsManagement;