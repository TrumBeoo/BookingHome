import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PersonAdd,
  Star,
  LocationOn,
  AttachMoney,
  CalendarToday,
  Assessment,
} from '@mui/icons-material';
import { useUserStats } from '../../hooks/useUsers';

const CustomerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const { stats, loading, error } = useUserStats();

  // Mock data for charts - replace with real data from API
  const mockData = {
    customerGrowth: [
      { month: 'T1', customers: 120 },
      { month: 'T2', customers: 135 },
      { month: 'T3', customers: 158 },
      { month: 'T4', customers: 142 },
      { month: 'T5', customers: 167 },
      { month: 'T6', customers: 189 },
    ],
    topCustomers: [
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', totalSpent: 15000000, bookings: 12 },
      { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', totalSpent: 12500000, bookings: 8 },
      { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', totalSpent: 11200000, bookings: 10 },
      { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', totalSpent: 9800000, bookings: 7 },
      { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', totalSpent: 8900000, bookings: 6 },
    ],
    locationStats: [
      { location: 'Hồ Chí Minh', customers: 245, percentage: 35 },
      { location: 'Hà Nội', customers: 189, percentage: 27 },
      { location: 'Đà Nẵng', customers: 98, percentage: 14 },
      { location: 'Cần Thơ', customers: 67, percentage: 10 },
      { location: 'Khác', customers: 98, percentage: 14 },
    ],
    behaviorStats: {
      averageBookingsPerCustomer: 3.2,
      averageSpendingPerCustomer: 2500000,
      repeatCustomerRate: 68,
      customerSatisfactionRate: 4.3,
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Có lỗi xảy ra khi tải dữ liệu thống kê: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Thống kê & Phân tích khách hàng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Báo cáo chi tiết về hành vi và xu hướng khách hàng
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoảng thời gian</InputLabel>
          <Select
            value={timeRange}
            label="Khoảng thời gian"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">7 ngày qua</MenuItem>
            <MenuItem value="30days">30 ngày qua</MenuItem>
            <MenuItem value="90days">90 ngày qua</MenuItem>
            <MenuItem value="1year">1 năm qua</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Tổng khách hàng
                  </Typography>
                  <Typography variant="h4">
                    {stats?.total_customers || 697}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      +12% so với tháng trước
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonAdd />
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
                    Khách hàng mới
                  </Typography>
                  <Typography variant="h4">
                    {stats?.new_customers_this_month || 89}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      +8% so với tháng trước
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PersonAdd />
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
                    Tỷ lệ khách quay lại
                  </Typography>
                  <Typography variant="h4">
                    {mockData.behaviorStats.repeatCustomerRate}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      +5% so với tháng trước
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Assessment />
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
                    Đánh giá trung bình
                  </Typography>
                  <Typography variant="h4">
                    {mockData.behaviorStats.customerSatisfactionRate}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Từ 1,234 đánh giá
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Customers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top khách hàng VIP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Khách hàng có tổng chi tiêu cao nhất
            </Typography>
            <List>
              {mockData.topCustomers.map((customer, index) => (
                <ListItem key={customer.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: index < 3 ? 'primary.main' : 'grey.400' }}>
                      {index + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {customer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {customer.email}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                            {formatCompactCurrency(customer.totalSpent)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {customer.bookings} đặt phòng
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố địa lý
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Khách hàng theo tỉnh/thành phố
            </Typography>
            <List>
              {mockData.locationStats.map((location, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            {location.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {location.customers} khách hàng ({location.percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={location.percentage}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Behavior Analytics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Phân tích hành vi khách hàng
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.contrastText" gutterBottom>
                    {mockData.behaviorStats.averageBookingsPerCustomer}
                  </Typography>
                  <Typography variant="body2" color="primary.contrastText">
                    Số đặt phòng trung bình/khách hàng
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="success.contrastText" gutterBottom>
                    {formatCompactCurrency(mockData.behaviorStats.averageSpendingPerCustomer)}
                  </Typography>
                  <Typography variant="body2" color="success.contrastText">
                    Chi tiêu trung bình/khách hàng
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="info.contrastText" gutterBottom>
                    {mockData.behaviorStats.repeatCustomerRate}%
                  </Typography>
                  <Typography variant="body2" color="info.contrastText">
                    Tỷ lệ khách hàng quay lại
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="warning.contrastText" gutterBottom>
                    {mockData.behaviorStats.customerSatisfactionRate}/5
                  </Typography>
                  <Typography variant="body2" color="warning.contrastText">
                    Mức độ hài lòng trung bình
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Customer Segments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Phân khúc khách hàng
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Chip label="VIP" color="error" sx={{ mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      45
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chi tiêu &gt; 10M VNĐ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Chip label="Thường xuyên" color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      156
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5+ đặt phòng/năm
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Chip label="Bình thường" color="success" sx={{ mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      298
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2-4 đặt phòng/năm
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Chip label="Mới" color="warning" sx={{ mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      198
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1 đặt phòng hoặc chưa đặt
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerAnalytics;