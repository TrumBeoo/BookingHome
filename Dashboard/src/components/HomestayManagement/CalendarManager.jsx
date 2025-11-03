import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  CalendarToday,
  Block,
  CheckCircle,
  AttachMoney
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import ApiService from '../../services/api';

const CalendarManager = ({ homestay, onUpdate, showSnackbar }) => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAvailable, setIsAvailable] = useState(true);
  const [priceOverride, setPriceOverride] = useState('');
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  useEffect(() => {
    loadAvailability();
  }, [homestay]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const currentDate = new Date();
      const response = await ApiService.getQuickAvailability(
        homestay.id, 
        currentDate.getMonth() + 1, 
        currentDate.getFullYear()
      );
      
      // Convert availability data to array format
      const availabilityArray = [];
      if (response.availability) {
        Object.entries(response.availability).forEach(([date, data]) => {
          availabilityArray.push({
            id: date,
            date: date,
            is_available: data.status === 'available',
            price_override: data.min_price
          });
        });
      }
      
      setAvailability(availabilityArray);
    } catch (error) {
      console.error('Error loading availability:', error);
      showSnackbar('Không thể tải lịch trống', 'error');
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvailability = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    setLoading(true);
    try {
      if (isAvailable) {
        await ApiService.unblockDates(homestay.id, [dateStr]);
      } else {
        await ApiService.blockDates(homestay.id, [dateStr]);
      }
      
      showSnackbar('Thêm lịch trống thành công');
      resetForm();
      setOpenDialog(false);
      loadAvailability();
    } catch (error) {
      showSnackbar('Không thể thêm lịch trống', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async () => {
    if (!editingAvailability) return;

    setLoading(true);
    try {
      if (editingAvailability.is_available) {
        await ApiService.unblockDates(homestay.id, [editingAvailability.date]);
      } else {
        await ApiService.blockDates(homestay.id, [editingAvailability.date]);
      }
      
      showSnackbar('Cập nhật lịch trống thành công');
      setEditingAvailability(null);
      setOpenDialog(false);
      loadAvailability();
    } catch (error) {
      showSnackbar('Không thể cập nhật lịch trống', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (dateStr) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch này?')) return;

    setLoading(true);
    try {
      // Reset to default (unblock)
      await ApiService.unblockDates(homestay.id, [dateStr]);
      showSnackbar('Xóa lịch trống thành công');
      loadAvailability();
    } catch (error) {
      showSnackbar('Không thể xóa lịch trống', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async () => {
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;
    
    if (startDate > endDate) {
      showSnackbar('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'error');
      return;
    }

    // Generate date array
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setLoading(true);
    try {
      if (isAvailable) {
        await ApiService.unblockDates(homestay.id, dates);
      } else {
        await ApiService.blockDates(homestay.id, dates);
      }
      
      showSnackbar('Cập nhật hàng loạt thành công');
      resetForm();
      setOpenDialog(false);
      loadAvailability();
    } catch (error) {
      showSnackbar('Không thể cập nhật hàng loạt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setIsAvailable(true);
    setPriceOverride('');
    setEditingAvailability(null);
    setDateRange({
      startDate: new Date(),
      endDate: new Date()
    });
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getAvailabilityStatus = (item) => {
    if (item.is_available) {
      return { color: 'success', label: 'Có sẵn', icon: <CheckCircle /> };
    } else {
      return { color: 'error', label: 'Không có sẵn', icon: <Block /> };
    }
  };

  const sortedAvailability = availability.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Quản lý lịch trống cho: {homestay.name} (ID: {homestay.id})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
            >
              Thêm ngày
            </Button>
            <Button
              variant="contained"
              startIcon={<CalendarToday />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
            >
              Cập nhật hàng loạt
            </Button>
          </Box>
        </Box>

        {/* Debug Info */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Info:
          </Typography>
          <Typography variant="body2">
            Homestay ID: {homestay.id} | Availability Records: {availability.length} | Loading: {loading.toString()}
          </Typography>
          {availability.length > 0 && (
            <Typography variant="body2">
              Sample: {JSON.stringify(availability[0], null, 2)}
            </Typography>
          )}
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Lịch trống hiện tại
                  </Typography>
                  {sortedAvailability.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Chưa có lịch trống nào được thiết lập
                      </Typography>
                    </Paper>
                  ) : (
                    <List>
                      {sortedAvailability.map((item, index) => {
                        const status = getAvailabilityStatus(item);
                        return (
                          <React.Fragment key={item.id}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle1">
                                      {formatDate(item.date)}
                                    </Typography>
                                    <Chip
                                      icon={status.icon}
                                      label={status.label}
                                      color={status.color}
                                      size="small"
                                    />
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Giá gốc: {formatPrice(homestay.price_per_night || 0)}
                                    </Typography>
                                    {item.price_override && (
                                      <Typography variant="body2" color="primary.main">
                                        Giá đặc biệt: {formatPrice(item.price_override)}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingAvailability({ ...item });
                                    setOpenDialog(true);
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteAvailability(item.date)}
                                >
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < sortedAvailability.length - 1 && <Divider />}
                          </React.Fragment>
                        );
                      })}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thống kê
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {availability.filter(a => a.is_available).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ngày có sẵn
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="error.main">
                        {availability.filter(a => !a.is_available).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ngày không có sẵn
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        {availability.filter(a => a.price_override).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ngày có giá đặc biệt
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Add/Edit Availability Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAvailability ? 'Chỉnh sửa lịch trống' : 'Thêm lịch trống'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {!editingAvailability && (
                <>
                  <DatePicker
                    label="Chọn ngày"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Hoặc chọn khoảng thời gian:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                      label="Từ ngày"
                      value={dateRange.startDate}
                      onChange={(newValue) => setDateRange({ ...dateRange, startDate: newValue })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                    <DatePicker
                      label="Đến ngày"
                      value={dateRange.endDate}
                      onChange={(newValue) => setDateRange({ ...dateRange, endDate: newValue })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                </>
              )}

              {editingAvailability && (
                <TextField
                  label="Ngày"
                  value={formatDate(editingAvailability.date)}
                  disabled
                  fullWidth
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={editingAvailability ? editingAvailability.is_available : isAvailable}
                    onChange={(e) => {
                      if (editingAvailability) {
                        setEditingAvailability({ ...editingAvailability, is_available: e.target.checked });
                      } else {
                        setIsAvailable(e.target.checked);
                      }
                    }}
                  />
                }
                label="Có sẵn để đặt"
              />

              <TextField
                label="Giá đặc biệt (VNĐ)"
                type="number"
                value={editingAvailability ? editingAvailability.price_override || '' : priceOverride}
                onChange={(e) => {
                  if (editingAvailability) {
                    setEditingAvailability({ ...editingAvailability, price_override: e.target.value });
                  } else {
                    setPriceOverride(e.target.value);
                  }
                }}
                helperText={`Giá gốc: ${formatPrice(homestay.price_per_night || 0)}`}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} startIcon={<Cancel />}>
              Hủy
            </Button>
            {!editingAvailability && (
              <Button
                onClick={handleBulkUpdate}
                variant="outlined"
                startIcon={<CalendarToday />}
                disabled={loading}
              >
                Cập nhật khoảng thời gian
              </Button>
            )}
            <Button
              onClick={editingAvailability ? handleUpdateAvailability : handleAddAvailability}
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : (editingAvailability ? 'Cập nhật' : 'Thêm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarManager;