import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Fade,
  Slide,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Home,
  People,
  AttachMoney,
  Star,
  CalendarToday,
  Notifications,
  MoreVert,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';

const DashboardOverview = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const statsCards = [
    {
      title: 'Tổng Homestay',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Home,
      color: 'primary',
      bgColor: 'primary.light',
    },
    {
      title: 'Khách hàng',
      value: '2,847',
      change: '+8%',
      trend: 'up',
      icon: People,
      color: 'success',
      bgColor: 'success.light',
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45.2M',
      change: '+15%',
      trend: 'up',
      icon: AttachMoney,
      color: 'warning',
      bgColor: 'warning.light',
    },
    {
      title: 'Đánh giá TB',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'info',
      bgColor: 'info.light',
    },
  ];

  const recentBookings = [
    {
      id: 1,
      guestName: 'Nguyễn Văn A',
      homestay: 'Villa Sapa View',
      checkIn: '2024-01-15',
      status: 'confirmed',
      amount: '2,400,000',
    },
    {
      id: 2,
      guestName: 'Trần Thị B',
      homestay: 'Homestay Hội An',
      checkIn: '2024-01-16',
      status: 'pending',
      amount: '1,600,000',
    },
    {
      id: 3,
      guestName: 'Lê Văn C',
      homestay: 'Bungalow Phú Quốc',
      checkIn: '2024-01-17',
      status: 'confirmed',
      amount: '3,000,000',
    },
    {
      id: 4,
      guestName: 'Phạm Thị D',
      homestay: 'Villa Đà Lạt',
      checkIn: '2024-01-18',
      status: 'cancelled',
      amount: '2,200,000',
    },
  ];

  const topHomestays = [
    {
      name: 'Villa Sapa View',
      bookings: 89,
      revenue: 28800000,
      rating: 4.9,
      occupancy: 85,
    },
    {
      name: 'Homestay Hội An',
      bookings: 67,
      revenue: 24800000,
      rating: 4.8,
      occupancy: 78,
    },
    {
      name: 'Bungalow Phú Quốc',
      bookings: 34,
      revenue: 28500000,
      rating: 4.7,
      occupancy: 65,
    },
  ];

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'pending':
        return <Schedule />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Slide direction="down" in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Dashboard Tổng quan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Chào mừng trở lại! Đây là tổng quan về hoạt động kinh doanh của bạn.
            </Typography>
          </Box>
        </Slide>

        {/* Stats Cards */}
        <Slide direction="up" in timeout={800}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" gutterBottom variant="body2">
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" component="div">
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {stat.trend === 'up' ? (
                            <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                          ) : (
                            <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
                          )}
                          <Typography
                            variant="body2"
                            color={stat.trend === 'up' ? 'success.main' : 'error.main'}
                          >
                            {stat.change}
                          </Typography>
                        </Box>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: stat.bgColor,
                          color: `${stat.color}.main`,
                          width: 56,
                          height: 56,
                        }}
                      >
                        <stat.icon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Slide>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recent Bookings */}
          <Grid item xs={12} md={8}>
            <Slide direction="right" in timeout={1000}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Booking gần đây</Typography>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <List>
                    {recentBookings.map((booking, index) => (
                      <ListItem
                        key={booking.id}
                        sx={{
                          transition: 'all 0.2s ease',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getStatusIcon(booking.status)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2">{booking.guestName}</Typography>
                              <Typography variant="body2" color="primary.main" fontWeight={600}>
                                ₫{(parseInt(booking.amount) / 1000).toFixed(0)}K
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {booking.homestay}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Check-in: {booking.checkIn}
                                </Typography>
                              </Box>
                              <Chip
                                label={getStatusText(booking.status)}
                                color={getStatusColor(booking.status)}
                                size="small"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Top Homestays */}
          <Grid item xs={12} md={4}>
            <Slide direction="left" in timeout={1200}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Top Homestays</Typography>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <List>
                    {topHomestays.map((homestay, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          transition: 'all 0.2s ease',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" noWrap>
                              {homestay.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {homestay.bookings} bookings
                                </Typography>
                                <Typography variant="caption" color="success.main">
                                  ₫{(homestay.revenue / 1000000).toFixed(1)}M
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Star sx={{ fontSize: 14, color: 'warning.main', mr: 0.5 }} />
                                  <Typography variant="caption">{homestay.rating}</Typography>
                                </Box>
                                <Typography variant="caption" color="info.main">
                                  {homestay.occupancy}% lấp đầy
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Slide direction="up" in timeout={1400}>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Hành động nhanh
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Home sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2">Thêm Homestay</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <CalendarToday sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                        <Typography variant="body2">Quản lý lịch</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <People sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                        <Typography variant="body2">Quản lý khách</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Notifications sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                        <Typography variant="body2">Thông báo</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Slide>
      </Box>
    </Fade>
  );
};

export default DashboardOverview;