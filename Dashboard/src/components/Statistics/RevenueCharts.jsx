import React, { useState } from 'react';
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
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Home,
  People,
  CalendarToday,
} from '@mui/icons-material';

const RevenueCharts = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('revenue');

  // Mock data for revenue over time
  const revenueData = [
    { month: 'T1', revenue: 125000000, bookings: 45, commission: 12500000 },
    { month: 'T2', revenue: 98000000, bookings: 38, commission: 9800000 },
    { month: 'T3', revenue: 156000000, bookings: 52, commission: 15600000 },
    { month: 'T4', revenue: 189000000, bookings: 67, commission: 18900000 },
    { month: 'T5', revenue: 234000000, bookings: 78, commission: 23400000 },
    { month: 'T6', revenue: 267000000, bookings: 89, commission: 26700000 },
    { month: 'T7', revenue: 298000000, bookings: 95, commission: 29800000 },
    { month: 'T8', revenue: 312000000, bookings: 102, commission: 31200000 },
    { month: 'T9', revenue: 289000000, bookings: 87, commission: 28900000 },
    { month: 'T10', revenue: 345000000, bookings: 112, commission: 34500000 },
    { month: 'T11', revenue: 378000000, bookings: 125, commission: 37800000 },
    { month: 'T12', revenue: 412000000, bookings: 134, commission: 41200000 },
  ];

  // Mock data for homestay performance
  const homestayData = [
    { name: 'Villa Sapa View', revenue: 28800000, bookings: 89, rating: 4.9 },
    { name: 'Homestay Hội An', revenue: 24800000, bookings: 67, rating: 4.8 },
    { name: 'Bungalow Phú Quốc', revenue: 28500000, bookings: 34, rating: 4.7 },
    { name: 'Villa Đà Lạt', revenue: 22000000, bookings: 56, rating: 4.6 },
    { name: 'Homestay Mekong', revenue: 12000000, bookings: 18, rating: 4.2 },
  ];

  // Mock data for booking status distribution
  const bookingStatusData = [
    { name: 'Đã xác nhận', value: 65, color: '#4caf50' },
    { name: 'Chờ xác nhận', value: 20, color: '#ff9800' },
    { name: 'Đã hủy', value: 15, color: '#f44336' },
  ];

  // Mock data for payment methods
  const paymentMethodData = [
    { name: 'VNPay', value: 45, color: '#2196f3' },
    { name: 'MoMo', value: 30, color: '#e91e63' },
    { name: 'Chuyển khoản', value: 25, color: '#9c27b0' },
  ];

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  const formatTooltip = (value, name) => {
    if (name === 'revenue' || name === 'commission') {
      return [`${formatCurrency(value)} đ`, name === 'revenue' ? 'Doanh thu' : 'Hoa hồng'];
    }
    return [value, name === 'bookings' ? 'Booking' : name];
  };

  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const bookingGrowth = ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings * 100).toFixed(1);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Biểu đồ doanh thu
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Thời gian</InputLabel>
            <Select
              value={timeRange}
              label="Thời gian"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">Tuần</MenuItem>
              <MenuItem value="month">Tháng</MenuItem>
              <MenuItem value="quarter">Quý</MenuItem>
              <MenuItem value="year">Năm</MenuItem>
            </Select>
          </FormControl>
          <ButtonGroup size="small">
            <Button 
              variant={chartType === 'revenue' ? 'contained' : 'outlined'}
              onClick={() => setChartType('revenue')}
            >
              Doanh thu
            </Button>
            <Button 
              variant={chartType === 'bookings' ? 'contained' : 'outlined'}
              onClick={() => setChartType('bookings')}
            >
              Booking
            </Button>
            <Button 
              variant={chartType === 'comparison' ? 'contained' : 'outlined'}
              onClick={() => setChartType('comparison')}
            >
              So sánh
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Doanh thu tháng này
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(currentMonth.revenue)} đ
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {revenueGrowth > 0 ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      color={revenueGrowth > 0 ? 'success.main' : 'error.main'}
                    >
                      {Math.abs(revenueGrowth)}%
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney sx={{ color: 'success.main', fontSize: 40 }} />
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
                    Booking tháng này
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {currentMonth.bookings}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {bookingGrowth > 0 ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      color={bookingGrowth > 0 ? 'success.main' : 'error.main'}
                    >
                      {Math.abs(bookingGrowth)}%
                    </Typography>
                  </Box>
                </Box>
                <CalendarToday sx={{ color: 'primary.main', fontSize: 40 }} />
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
                    Hoa hồng tháng này
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {formatCurrency(currentMonth.commission)} đ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    10% doanh thu
                  </Typography>
                </Box>
                <TrendingUp sx={{ color: 'warning.main', fontSize: 40 }} />
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
                    Homestay hoạt động
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    {homestayData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tất cả đang hoạt động
                  </Typography>
                </Box>
                <Home sx={{ color: 'info.main', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {chartType === 'revenue' ? 'Xu hướng doanh thu' : 
               chartType === 'bookings' ? 'Xu hướng booking' : 
               'So sánh doanh thu và booking'}
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'revenue' ? (
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={formatTooltip} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4caf50" 
                    fill="#4caf50" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              ) : chartType === 'bookings' ? (
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={formatTooltip} />
                  <Bar dataKey="bookings" fill="#2196f3" />
                </BarChart>
              ) : (
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={formatCurrency} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4caf50" 
                    strokeWidth={3}
                    name="Doanh thu"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#2196f3" 
                    strokeWidth={3}
                    name="Booking"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố trạng thái booking
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Phương thức thanh toán
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Homestay Performance */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hiệu suất homestay
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={homestayData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value, name) => [
              name === 'revenue' ? `${formatCurrency(value)} đ` : value,
              name === 'revenue' ? 'Doanh thu' : name === 'bookings' ? 'Booking' : 'Đánh giá'
            ]} />
            <Bar dataKey="revenue" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default RevenueCharts;