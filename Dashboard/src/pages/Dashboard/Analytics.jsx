import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Download,
  DateRange,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [metricType, setMetricType] = useState('revenue');

  // Mock data
  const revenueData = [
    { month: 'T7/23', revenue: 8500000, bookings: 85, occupancy: 72 },
    { month: 'T8/23', revenue: 9200000, bookings: 92, occupancy: 78 },
    { month: 'T9/23', revenue: 11800000, bookings: 118, occupancy: 85 },
    { month: 'T10/23', revenue: 10500000, bookings: 105, occupancy: 80 },
    { month: 'T11/23', revenue: 12300000, bookings: 123, occupancy: 88 },
    { month: 'T12/23', revenue: 13800000, bookings: 138, occupancy: 92 },
  ];

  const locationData = [
    { name: 'Sa Pa', revenue: 35000000, bookings: 280, growth: 15.2 },
    { name: 'Hội An', revenue: 28000000, bookings: 350, growth: 12.8 },
    { name: 'Đà Lạt', revenue: 22000000, bookings: 220, growth: 8.5 },
    { name: 'Phú Quốc', revenue: 31000000, bookings: 190, growth: 22.3 },
    { name: 'Nha Trang', revenue: 18000000, bookings: 180, growth: -5.2 },
  ];

  const customerSegmentData = [
    { name: 'Gia đình', value: 45, color: '#0088FE', revenue: 45000000 },
    { name: 'Cặp đôi', value: 30, color: '#00C49F', revenue: 32000000 },
    { name: 'Bạn bè', value: 20, color: '#FFBB28', revenue: 28000000 },
    { name: 'Đơn lẻ', value: 5, color: '#FF8042', revenue: 8000000 },
  ];

  const monthlyComparisonData = [
    { month: 'T1', thisYear: 8500000, lastYear: 7200000 },
    { month: 'T2', thisYear: 9200000, lastYear: 8100000 },
    { month: 'T3', thisYear: 11800000, lastYear: 10200000 },
    { month: 'T4', thisYear: 10500000, lastYear: 9800000 },
    { month: 'T5', thisYear: 12300000, lastYear: 11000000 },
    { month: 'T6', thisYear: 13800000, lastYear: 12500000 },
  ];

  const topCustomers = [
    {
      name: 'Nguyễn Văn Nam',
      bookings: 12,
      revenue: 15600000,
      lastBooking: '2024-01-10',
      avatar: 'N',
    },
    {
      name: 'Trần Thị Lan',
      bookings: 8,
      revenue: 11200000,
      lastBooking: '2024-01-08',
      avatar: 'L',
    },
    {
      name: 'Lê Minh Tuấn',
      bookings: 6,
      revenue: 9800000,
      lastBooking: '2024-01-05',
      avatar: 'T',
    },
  ];

  const StatCard = ({ title, value, change, icon, color, suffix = '' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}{suffix}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {change > 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: change > 0 ? 'success.main' : 'error.main',
                  fontWeight: 'medium',
                  ml: 0.5,
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ ml: 1 }}
              >
                vs tháng trước
              </Typography>
            </Box>
          </Box>
          <Avatar
            sx={{
              bgcolor: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Phân tích & Báo cáo">
      <Box>
        {/* Header Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard Phân tích
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Khoảng thời gian"
              >
                <MenuItem value="1month">1 tháng</MenuItem>
                <MenuItem value="3months">3 tháng</MenuItem>
                <MenuItem value="6months">6 tháng</MenuItem>
                <MenuItem value="1year">1 năm</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Xuất báo cáo
            </Button>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Tổng doanh thu"
              value="125M"
              change={15.2}
              icon="₫"
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Số lượt đặt"
              value="1,284"
              change={8.7}
              icon="#"
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Tỷ lệ lấp đầy"
              value="85"
              change={5.3}
              icon="%"
              color="warning.main"
              suffix="%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Giá trung bình"
              value="1.2M"
              change={-2.1}
              icon="₫"
              color="info.main"
            />
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Revenue Trend */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Xu hướng doanh thu & đặt phòng
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'revenue' ? `${(value / 1000000).toFixed(1)}M VNĐ` : value,
                        name === 'revenue' ? 'Doanh thu' : name === 'bookings' ? 'Đặt phòng' : 'Tỷ lệ lấp đầy'
                      ]}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="url(#colorRevenue)"
                      stroke="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Bar yAxisId="right" dataKey="bookings" fill="#82ca9d" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#ff7300"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Segments */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Phân khúc khách hàng
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={customerSegmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {customerSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {customerSegmentData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Location Performance */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Hiệu suất theo địa điểm
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Địa điểm</TableCell>
                        <TableCell align="right">Doanh thu</TableCell>
                        <TableCell align="right">Đặt phòng</TableCell>
                        <TableCell align="right">Tăng trưởng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {locationData.map((location, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {location.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                              {(location.revenue / 1000000).toFixed(0)}M
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {location.bookings}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              {location.growth > 0 ? (
                                <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                              ) : (
                                <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: location.growth > 0 ? 'success.main' : 'error.main',
                                  fontWeight: 600,
                                }}
                              >
                                {location.growth > 0 ? '+' : ''}{location.growth}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Customers */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Khách hàng VIP
                </Typography>
                {topCustomers.map((customer, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 2,
                      borderBottom: index < topCustomers.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {customer.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {customer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer.bookings} đặt phòng
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 600 }}>
                        {(customer.revenue / 1000000).toFixed(1)}M đ
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Lần cuối: {new Date(customer.lastBooking).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Year over Year Comparison */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  So sánh theo năm
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      formatter={(value) => [`${(value / 1000000).toFixed(1)}M VNĐ`, 'Doanh thu']}
                    />
                    <Bar dataKey="lastYear" fill="#8884d8" name="Năm trước" />
                    <Bar dataKey="thisYear" fill="#82ca9d" name="Năm nay" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Analytics;