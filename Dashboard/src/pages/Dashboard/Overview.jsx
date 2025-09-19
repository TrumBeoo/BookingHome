import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Home,
  AttachMoney,
  BookOnline,
  MoreVert,
  Visibility,
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
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Overview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 125000000,
    revenueGrowth: 12.5,
    totalBookings: 1284,
    bookingsGrowth: 8.2,
    totalProperties: 145,
    propertiesGrowth: 15.3,
    totalCustomers: 2847,
    customersGrowth: 18.7,
  });

  // Mock data for charts
  const revenueData = [
    { month: 'T1', revenue: 8500000, bookings: 85 },
    { month: 'T2', revenue: 9200000, bookings: 92 },
    { month: 'T3', revenue: 11800000, bookings: 118 },
    { month: 'T4', revenue: 10500000, bookings: 105 },
    { month: 'T5', revenue: 12300000, bookings: 123 },
    { month: 'T6', revenue: 13800000, bookings: 138 },
  ];

  const propertyTypeData = [
    { name: 'Villa', value: 35, color: '#0088FE' },
    { name: 'Homestay', value: 45, color: '#00C49F' },
    { name: 'Resort Mini', value: 15, color: '#FFBB28' },
    { name: 'Bungalow', value: 5, color: '#FF8042' },
  ];

  const topProperties = [
    {
      id: 1,
      name: 'Villa Sapa View',
      location: 'Sa Pa, Lào Cai',
      bookings: 24,
      revenue: 28800000,
      rating: 4.9,
      occupancy: 89,
    },
    {
      id: 2,
      name: 'Homestay Hội An',
      location: 'Hội An, Quảng Nam',
      bookings: 31,
      revenue: 24800000,
      rating: 4.8,
      occupancy: 92,
    },
    {
      id: 3,
      name: 'Bungalow Phú Quốc',
      location: 'Phú Quốc, Kiên Giang',
      bookings: 19,
      revenue: 28500000,
      rating: 4.7,
      occupancy: 76,
    },
    {
      id: 4,
      name: 'Villa Đà Lạt',
      location: 'Đà Lạt, Lâm Đồng',
      bookings: 22,
      revenue: 22000000,
      rating: 4.6,
      occupancy: 84,
    },
  ];

  const recentBookings = [
    {
      id: 'BK001',
      customer: 'Nguyễn Văn Nam',
      property: 'Villa Sapa View',
      checkIn: '2024-01-15',
      amount: 2400000,
      status: 'confirmed',
    },
    {
      id: 'BK002',
      customer: 'Trần Thị Lan',
      property: 'Homestay Hội An',
      checkIn: '2024-01-16',
      amount: 1600000,
      status: 'pending',
    },
    {
      id: 'BK003',
      customer: 'Lê Minh Tuấn',
      property: 'Bungalow Phú Quốc',
      checkIn: '2024-01-17',
      amount: 3000000,
      status: 'confirmed',
    },
  ];

  const StatCard = ({ title, value, growth, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {typeof value === 'number' && value > 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : value.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {growth > 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: growth > 0 ? 'success.main' : 'error.main',
                  fontWeight: 'medium',
                  ml: 0.5,
                }}
              >
                {growth > 0 ? '+' : ''}{growth}%
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout title="Tổng quan">
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Tổng doanh thu"
            value={stats.totalRevenue}
            growth={stats.revenueGrowth}
            icon={<AttachMoney />}
            color="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Đặt phòng"
            value={stats.totalBookings}
            growth={stats.bookingsGrowth}
            icon={<BookOnline />}
            color="info.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Homestay"
            value={stats.totalProperties}
            growth={stats.propertiesGrowth}
            icon={<Home />}
            color="success.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Khách hàng"
            value={stats.totalCustomers}
            growth={stats.customersGrowth}
            icon={<People />}
            color="warning.main"
          />
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Doanh thu theo tháng
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value) => [`${(value / 1000000).toFixed(1)}M VNĐ`, 'Doanh thu']}
                    labelFormatter={(label) => `Tháng ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Property Types */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Loại hình homestay
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {propertyTypeData.map((item, index) => (
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

        {/* Top Properties */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Homestay hiệu quả nhất
                </Typography>
                <Button size="small">Xem tất cả</Button>
              </Box>
              
              {topProperties.map((property, index) => (
                <Box
                  key={property.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    borderBottom: index < topProperties.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {property.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.location}
                      </Typography>
                    </Box>
                  </Box>
                  
                <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {(property.revenue / 1000000).toFixed(1)}M đ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.bookings} đặt phòng
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {property.occupancy}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={property.occupancy}
                      sx={{ mt: 0.5, width: 60 }}
                    />
                  </Box>
                  
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Đặt phòng gần đây
                </Typography>
                <Button size="small">Xem tất cả</Button>
              </Box>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã DP</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Số tiền</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {booking.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {booking.customer}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.property}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(booking.checkIn).toLocaleDateString('vi-VN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {(booking.amount / 1000000).toFixed(1)}M
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(booking.status)}
                            color={getStatusColor(booking.status)}
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
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Thao tác nhanh
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                  >
                    <Home sx={{ fontSize: 32 }} />
                    <Typography variant="body2">Thêm homestay</Typography>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                  >
                    <BookOnline sx={{ fontSize: 32 }} />
                    <Typography variant="body2">Xem đặt phòng</Typography>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                  >
                    <People sx={{ fontSize: 32 }} />
                    <Typography variant="body2">Quản lý khách</Typography>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                  >
                    <Visibility sx={{ fontSize: 32 }} />
                    <Typography variant="body2">Báo cáo</Typography>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Overview;