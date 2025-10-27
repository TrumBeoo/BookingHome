import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Calendar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  Weekend as WeekendIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const PricingDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pricingData, setPricingData] = useState({});
  const [editDialog, setEditDialog] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [priceForm, setPriceForm] = useState({
    base_price: '',
    weekend_multiplier: 1.3,
    holiday_multiplier: 1.8,
    special_price: '',
    combo_discount: ''
  });

  // Danh sách ngày lễ
  const holidays = [
    { date: '2024-01-01', name: 'Tết Dương lịch' },
    { date: '2024-02-10', name: 'Tết Nguyên đán' },
    { date: '2024-04-18', name: 'Giỗ Tổ Hùng Vương' },
    { date: '2024-04-30', name: 'Ngày Giải phóng miền Nam' },
    { date: '2024-05-01', name: 'Quốc tế Lao động' },
    { date: '2024-09-02', name: 'Quốc khánh' }
  ];

  const getDateType = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    if (holidays.some(h => h.date === dateStr)) {
      return { type: 'holiday', color: '#f44336', label: 'Ngày lễ' };
    }
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { type: 'weekend', color: '#ff9800', label: 'Cuối tuần' };
    }
    return { type: 'normal', color: '#4caf50', label: 'Ngày thường' };
  };

  const calculatePrice = (date, basePrice = 1000000) => {
    const dateType = getDateType(date);
    const multiplier = dateType.type === 'holiday' ? 1.8 : 
                     dateType.type === 'weekend' ? 1.3 : 1;
    return basePrice * multiplier;
  };

  const handleEditPrice = (date) => {
    setEditingDate(date);
    const price = calculatePrice(date);
    setPriceForm({
      ...priceForm,
      base_price: price,
      special_price: price
    });
    setEditDialog(true);
  };

  const handleSavePrice = () => {
    const dateStr = editingDate.toISOString().split('T')[0];
    setPricingData({
      ...pricingData,
      [dateStr]: {
        price: priceForm.special_price,
        combo_discount: priceForm.combo_discount
      }
    });
    setEditDialog(false);
  };

  const renderCalendarDay = (date) => {
    const dateType = getDateType(date);
    const price = calculatePrice(date);
    const dateStr = date.toISOString().split('T')[0];
    const customPrice = pricingData[dateStr];

    return (
      <Box
        sx={{
          p: 1,
          border: `2px solid ${dateType.color}`,
          borderRadius: 1,
          backgroundColor: customPrice ? '#e3f2fd' : 'transparent',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
        onClick={() => handleEditPrice(date)}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {date.getDate()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {dateType.type === 'weekend' && <WeekendIcon sx={{ fontSize: 12 }} />}
          {dateType.type === 'holiday' && <EventIcon sx={{ fontSize: 12 }} />}
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {dateType.label}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ 
          fontWeight: 'bold',
          color: customPrice ? '#1976d2' : dateType.color
        }}>
          {(customPrice?.price || price).toLocaleString()}đ
        </Typography>
        {customPrice?.combo_discount && (
          <Chip 
            label={`-${customPrice.combo_discount}%`}
            size="small"
            sx={{ fontSize: '0.6rem', height: 16 }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarIcon color="primary" />
        Quản lý giá phòng & lịch giá
      </Typography>

      <Grid container spacing={3}>
        {/* Thống kê tổng quan */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingIcon color="primary" />
                Thống kê giá
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Giá ngày thường:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    1.000.000đ
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Giá cuối tuần:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    1.300.000đ (+30%)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Giá ngày lễ:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                    1.800.000đ (+80%)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Combo packages */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Combo ưu đãi
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    border: '2px solid #4caf50', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#4caf50' }}>
                      Combo 3N2Đ
                    </Typography>
                    <Typography variant="body2">
                      Giảm 15% cho đặt phòng từ 3 đêm
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                      2.550.000đ
                    </Typography>
                    <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
                      3.000.000đ
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    border: '2px solid #ff9800', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#ff9800' }}>
                      Combo Cuối tuần
                    </Typography>
                    <Typography variant="body2">
                      Đặt T7-CN tặng ăn sáng
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                      2.600.000đ
                    </Typography>
                    <Typography variant="caption">
                      + Ăn sáng miễn phí
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    p: 2, 
                    border: '2px solid #f44336', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#f44336' }}>
                      Combo Lễ 30/4
                    </Typography>
                    <Typography variant="body2">
                      Gói trọn 3N2Đ dịp lễ
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                      4.500.000đ
                    </Typography>
                    <Typography variant="caption">
                      Bao gồm tour + xe đưa đón
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Lịch giá */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Lịch giá tháng {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
              </Typography>
              
              {/* Chú thích */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label="Ngày thường" sx={{ backgroundColor: '#4caf50', color: 'white' }} />
                <Chip label="Cuối tuần" sx={{ backgroundColor: '#ff9800', color: 'white' }} />
                <Chip label="Ngày lễ" sx={{ backgroundColor: '#f44336', color: 'white' }} />
              </Box>

              {/* Lưới lịch đơn giản */}
              <Grid container spacing={1}>
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
                  return (
                    <Grid item xs={12/7} key={i}>
                      {renderCalendarDay(date)}
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog chỉnh sửa giá */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chỉnh sửa giá ngày {editingDate?.toLocaleDateString('vi-VN')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Giá đặc biệt (đ)"
                value={priceForm.special_price}
                onChange={(e) => setPriceForm({ ...priceForm, special_price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Giảm giá combo (%)"
                value={priceForm.combo_discount}
                onChange={(e) => setPriceForm({ ...priceForm, combo_discount: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          <Button onClick={handleSavePrice} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PricingDashboard;