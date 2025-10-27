import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Assessment as ReportIcon,
  LocalOffer as OfferIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const RevenueReport = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedPromotion, setSelectedPromotion] = useState('all');

  // Mock data
  const revenueData = [
    { name: 'T1', revenue: 45000000, promotions: 8000000, bookings: 25 },
    { name: 'T2', revenue: 52000000, promotions: 12000000, bookings: 32 },
    { name: 'T3', revenue: 48000000, promotions: 9000000, bookings: 28 },
    { name: 'T4', revenue: 61000000, promotions: 15000000, bookings: 38 },
    { name: 'T5', revenue: 55000000, promotions: 11000000, bookings: 35 },
    { name: 'T6', revenue: 67000000, promotions: 18000000, bookings: 42 }
  ];

  const promotionStats = [
    { 
      name: 'AUTUMN30', 
      usage: 156, 
      revenue: 45000000, 
      discount: 15000000,
      roi: 200,
      status: 'active'
    },
    { 
      name: 'WEEKEND20', 
      usage: 89, 
      revenue: 28000000, 
      discount: 7000000,
      roi: 150,
      status: 'active'
    },
    { 
      name: 'COMBO3N2D', 
      usage: 67, 
      revenue: 35000000, 
      discount: 12000000,
      roi: 180,
      status: 'active'
    },
    { 
      name: 'SUMMER20', 
      usage: 234, 
      revenue: 62000000, 
      discount: 18000000,
      roi: 220,
      status: 'expired'
    }
  ];

  const pieData = [
    { name: 'Doanh thu thường', value: 65, color: '#4caf50' },
    { name: 'Doanh thu từ khuyến mãi', value: 35, color: '#ff9800' }
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalPromotionRevenue = revenueData.reduce((sum, item) => sum + item.promotions, 0);
  const totalBookings = revenueData.reduce((sum, item) => sum + item.bookings, 0);
  const avgBookingValue = totalRevenue / totalBookings;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportIcon color="primary" />
        Báo cáo doanh thu & chiến dịch
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Thời gian</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Thời gian"
            >
              <MenuItem value="week">7 ngày qua</MenuItem>
              <MenuItem value="month">30 ngày qua</MenuItem>
              <MenuItem value="quarter">3 tháng qua</MenuItem>
              <MenuItem value="year">12 tháng qua</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Khuyến mãi</InputLabel>
            <Select
              value={selectedPromotion}
              onChange={(e) => setSelectedPromotion(e.target.value)}
              label="Khuyến mãi"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="AUTUMN30">AUTUMN30</MenuItem>
              <MenuItem value="WEEKEND20">WEEKEND20</MenuItem>
              <MenuItem value="COMBO3N2D">COMBO3N2D</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MoneyIcon color="primary" />
                <Typography variant="h6">Tổng doanh thu</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {totalRevenue.toLocaleString()}đ
              </Typography>
              <Typography variant="body2" color="success.main">
                +12% so với tháng trước
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <OfferIcon color="warning" />
                <Typography variant="h6">DT từ khuyến mãi</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {totalPromotionRevenue.toLocaleString()}đ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((totalPromotionRevenue / totalRevenue) * 100).toFixed(1)}% tổng doanh thu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingIcon color="success" />
                <Typography variant="h6">Tổng đặt phòng</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {totalBookings}
              </Typography>
              <Typography variant="body2" color="success.main">
                +8% so với tháng trước
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ReportIcon color="info" />
                <Typography variant="h6">Giá trị TB/đơn</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {avgBookingValue.toLocaleString()}đ
              </Typography>
              <Typography variant="body2" color="info.main">
                +5% so với tháng trước
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Biểu đồ doanh thu theo thời gian
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()}đ`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    name="Tổng doanh thu"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="promotions" 
                    stroke="#ff9800" 
                    strokeWidth={2}
                    name="DT từ khuyến mãi"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Tỷ lệ doanh thu
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Promotion Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Hiệu quả các chương trình khuyến mãi
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã khuyến mãi</TableCell>
                  <TableCell align="right">Lượt sử dụng</TableCell>
                  <TableCell align="right">Doanh thu tạo ra</TableCell>
                  <TableCell align="right">Tổng giảm giá</TableCell>
                  <TableCell align="right">ROI (%)</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotionStats.map((promo) => (
                  <TableRow key={promo.name}>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {promo.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{promo.usage}</TableCell>
                    <TableCell align="right">
                      {promo.revenue.toLocaleString()}đ
                    </TableCell>
                    <TableCell align="right">
                      {promo.discount.toLocaleString()}đ
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: promo.roi >= 200 ? '#4caf50' : promo.roi >= 150 ? '#ff9800' : '#f44336'
                        }}
                      >
                        {promo.roi}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={promo.status === 'active' ? 'Hoạt động' : 'Đã hết hạn'}
                        color={promo.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RevenueReport;