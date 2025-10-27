import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RevenueCharts from '../../components/Statistics/RevenueCharts';

// Placeholder components for statistics sections
const HomestayStatistics = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Thống kê Homestay
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Thống kê số lượng homestay đang hoạt động - Phân tích theo khu vực,
        loại hình, mức giá và tình trạng hoạt động.
      </Typography>
    </Paper>
  </Box>
);

const BookingStatistics = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Thống kê Booking
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Thống kê lượng booking thành công/bị hủy - Phân tích tỷ lệ thành công,
        nguyên nhân hủy và xu hướng đặt phòng theo thời gian.
      </Typography>
    </Paper>
  </Box>
);

const RevenueOverview = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Doanh thu tổng
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Doanh thu tổng và chi tiết theo homestay - Phân tích doanh thu
        từng homestay, so sánh hiệu suất và xác định homestay có lợi nhuận cao.
      </Typography>
    </Paper>
  </Box>
);

const Statistics = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Homestay', path: '/dashboard/statistics/homestays', component: <HomestayStatistics /> },
    { label: 'Booking', path: '/dashboard/statistics/bookings', component: <BookingStatistics /> },
    { label: 'Doanh thu', path: '/dashboard/statistics/revenue', component: <RevenueOverview /> },
    { label: 'Biểu đồ', path: '/dashboard/statistics/charts', component: <RevenueCharts /> },
  ];

  const currentTab = tabs.findIndex(tab => location.pathname === tab.path);

  const handleTabChange = (event, newValue) => {
    navigate(tabs[newValue].path);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Thống kê & Báo cáo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thống kê hoạt động và phân tích doanh thu của hệ thống
          </Typography>
        </Box>

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={currentTab >= 0 ? currentTab : 0}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="homestays" element={<HomestayStatistics />} />
              <Route path="bookings" element={<BookingStatistics />} />
              <Route path="revenue" element={<RevenueOverview />} />
              <Route path="charts" element={<RevenueCharts />} />
              <Route path="*" element={<HomestayStatistics />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default Statistics;