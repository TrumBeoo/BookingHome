import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Block,
  CheckCircle,
  AttachMoney,
  CalendarToday,
  Event,
  EventBusy,
  Today,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import ApiService from '../../services/api';

const HomestayCalendar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [homestay, setHomestay] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialog, setDialog] = useState({ open: false, type: '', data: null });
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    start_date: null,
    end_date: null,
    status: 'available',
    price: '',
    min_nights: 1,
    max_nights: 30,
    notes: '',
  });

  useEffect(() => {
    loadHomestayCalendar();
  }, [id]);

  const loadHomestayCalendar = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load homestay info
      const homestayResponse = await ApiService.getHomestay(id);
      const homestayData = homestayResponse.data || homestayResponse.homestay || homestayResponse;
      
      if (!homestayData) {
        throw new Error('Không tìm thấy thông tin homestay');
      }
      
      setHomestay(homestayData);
      
      // Try to load calendar data from API
      try {
        const calendarResponse = await ApiService.getHomestayCalendar(id);
        const calendarData = calendarResponse.availability || calendarResponse.data || calendarResponse || [];
        setCalendar(Array.isArray(calendarData) ? calendarData : []);
      } catch (calendarError) {
        console.warn('Calendar API failed:', calendarError);
        setCalendar([]);
      }
    } catch (error) {
      console.error('Failed to load homestay calendar:', error);
      setError(error.message || 'Không thể tải lịch homestay. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type, data = null) => {
    if (data) {
      setFormData({
        start_date: new Date(data.date),
        end_date: new Date(data.date),
        status: data.status,
        price: data.price || '',
        min_nights: data.min_nights || 1,
        max_nights: data.max_nights || 30,
        notes: data.notes || '',
      });
    } else {
      setFormData({
        start_date: null,
        end_date: null,
        status: 'available',
        price: homestay?.price_per_night || '',
        min_nights: 1,
        max_nights: 30,
        notes: '',
      });
    }
    setDialog({ open: true, type, data });
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, type: '', data: null });
    setFormData({
      start_date: null,
      end_date: null,
      status: 'available',
      price: '',
      min_nights: 1,
      max_nights: 30,
      notes: '',
    });
  };

  const handleSave = async () => {
    if (!formData.start_date) {
      setError('Vui lòng chọn ngày');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Prepare data for API
      const apiData = {
        date: formData.start_date.toISOString().split('T')[0],
        status: formData.status,
        ...(formData.price && { price: parseFloat(formData.price) }),
        min_nights: parseInt(formData.min_nights) || 1,
        max_nights: parseInt(formData.max_nights) || 30,
        ...(formData.notes && { notes: formData.notes }),
      };

      // Try API call first
      try {
        if (dialog.type === 'add') {
          const response = await ApiService.addCalendarEntry(id, apiData);
          console.log('Add calendar response:', response);
        } else if (dialog.type === 'edit') {
          const response = await ApiService.updateCalendarEntry(id, dialog.data.id, apiData);
          console.log('Update calendar response:', response);
        }
        setSuccess(`Đã ${dialog.type === 'add' ? 'thêm' : 'cập nhật'} lịch thành công!`);
        loadHomestayCalendar();
      } catch (apiError) {
        console.error('Calendar API error:', apiError);
        throw new Error(`Lỗi API: ${apiError.message}`);
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save calendar:', error);
      setError('Có lỗi xảy ra: ' + (error.message || 'Không thể lưu lịch'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!item || !item.id) {
      setError('Không tìm thấy thông tin lịch');
      return;
    }

    try {
      // Try API call first
      try {
        await ApiService.deleteCalendarEntry(id, item.id);
        setSuccess('Đã xóa lịch thành công!');
        loadHomestayCalendar();
      } catch (apiError) {
        throw apiError;
      }
    } catch (error) {
      console.error('Failed to delete calendar entry:', error);
      setError('Có lỗi xảy ra: ' + (error.message || 'Không thể xóa lịch'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'booked':
        return 'info';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Có thể đặt';
      case 'booked':
        return 'Đã đặt';
      case 'blocked':
        return 'Bị chặn';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle />;
      case 'booked':
        return <Event />;
      case 'blocked':
        return <EventBusy />;
      default:
        return <CalendarToday />;
    }
  };

  const handleBack = () => {
    navigate('/dashboard/homestays');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" gutterBottom>
                Quản lý lịch
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {homestay?.name || 'Homestay'}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
          >
            Thêm lịch
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Có thể đặt
                    </Typography>
                    <Typography variant="h4">
                      {calendar.filter(c => c.status === 'available').length}
                    </Typography>
                  </Box>
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Đã đặt
                    </Typography>
                    <Typography variant="h4">
                      {calendar.filter(c => c.status === 'booked').length}
                    </Typography>
                  </Box>
                  <Event color="info" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Bị chặn
                    </Typography>
                    <Typography variant="h4">
                      {calendar.filter(c => c.status === 'blocked').length}
                    </Typography>
                  </Box>
                  <EventBusy color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Tổng ngày
                    </Typography>
                    <Typography variant="h4">
                      {calendar.length}
                    </Typography>
                  </Box>
                  <Today color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Calendar Table */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lịch chi tiết
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Giá (VNĐ)</TableCell>
                  <TableCell>Số đêm</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calendar.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(item.status)}
                        <Typography sx={{ ml: 1 }}>
                          {new Date(item.date).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(item.status)}
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {item.price ? (item.price / 1000).toFixed(0) + 'K' : '-'}
                    </TableCell>
                    <TableCell>
                      {item.min_nights && item.max_nights 
                        ? `${item.min_nights} - ${item.max_nights}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {item.notes || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {item.status !== 'booked' && (
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog('edit', item)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {item.status !== 'booked' && (
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(item)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {item.status === 'booked' && (
                          <Tooltip title="Đã có booking">
                            <IconButton size="small" disabled>
                              <Block />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog open={dialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialog.type === 'add' ? 'Thêm lịch mới' : 'Chỉnh sửa lịch'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={formData.start_date}
                  onChange={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.end_date}
                  onChange={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={formData.status}
                    label="Trạng thái"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="available">Có thể đặt</MenuItem>
                    <MenuItem value="blocked">Bị chặn</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Giá/đêm"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số đêm tối thiểu"
                  type="number"
                  value={formData.min_nights}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_nights: parseInt(e.target.value) }))}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số đêm tối đa"
                  type="number"
                  value={formData.max_nights}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_nights: parseInt(e.target.value) }))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={saving || !formData.start_date}
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default HomestayCalendar;