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
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Star,
  LocationOn,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const properties = [
    {
      id: 1,
      name: 'Villa Sapa Tuyệt Đẹp',
      location: 'Sa Pa, Lào Cai',
      type: 'Villa',
      price: 1200000,
      status: 'active',
      rating: 4.9,
      reviews: 124,
      bookings: 24,
      revenue: 28800000,
      occupancy: 89,
      images: 8,
      createdAt: '2023-06-15',
    },
    {
      id: 2,
      name: 'Homestay Hội An Cổ Kính',
      location: 'Hội An, Quảng Nam',
      type: 'Homestay',
      price: 800000,
      status: 'active',
      rating: 4.8,
      reviews: 89,
      bookings: 31,
      revenue: 24800000,
      occupancy: 92,
      images: 12,
      createdAt: '2023-05-20',
    },
    {
      id: 3,
      name: 'Bungalow Phú Quốc Resort',
      location: 'Phú Quốc, Kiên Giang',
      type: 'Bungalow',
      price: 1500000,
      status: 'maintenance',
      rating: 4.7,
      reviews: 156,
      bookings: 19,
      revenue: 28500000,
      occupancy: 76,
      images: 15,
      createdAt: '2023-04-10',
    },
    {
      id: 4,
      name: 'Villa Đà Lạt Mộng Mơ',
      location: 'Đà Lạt, Lâm Đồng',
      type: 'Villa',
      price: 1000000,
      status: 'inactive',
      rating: 4.6,
      reviews: 73,
      bookings: 22,
      revenue: 22000000,
      occupancy: 84,
      images: 10,
      createdAt: '2023-03-25',
    },
  ];

  const handleMenuOpen = (event, property) => {
    setAnchorEl(event.currentTarget);
    setSelectedProperty(property);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProperty(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    // Implement delete logic
    console.log('Deleting property:', selectedProperty?.id);
    setDeleteDialogOpen(false);
    setSelectedProperty(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'maintenance':
        return 'Bảo trì';
      case 'inactive':
        return 'Tạm dừng';
      default:
        return status;
    }
  };

  const columns = [
    {
      field: 'property',
      headerName: 'Homestay',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              mr: 2,
              bgcolor: 'primary.main',
            }}
          >
            {params.row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {params.row.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {params.row.location}
              </Typography>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Loại hình',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Giá/đêm',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
          {(params.value / 1000000).toFixed(1)}M đ
        </Typography>
      ),
    },
    {
      field: 'rating',
      headerName: 'Đánh giá',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
          <Typography variant="body2">
            {params.value} ({params.row.reviews})
          </Typography>
        </Box>
      ),
    },
    {
      field: 'occupancy',
      headerName: 'Tỷ lệ lấp đầy',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value}%
        </Typography>
      ),
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
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

  return (
    <DashboardLayout title="Quản lý Homestay">
      <Box>
        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Danh sách Homestay
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ px: 3 }}
          >
            Thêm homestay mới
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm homestay..."
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Trạng thái"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="maintenance">Bảo trì</MenuItem>
                    <MenuItem value="inactive">Tạm dừng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  fullWidth
                >
                  Bộ lọc
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Properties DataGrid */}
        <Card>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={properties}
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
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 2 }} />
            Chỉnh sửa
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 2 }} />
            Xóa
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa homestay "{selectedProperty?.name}"?
              Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Properties;