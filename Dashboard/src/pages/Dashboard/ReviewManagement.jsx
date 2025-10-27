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

// Placeholder components for review management sections
const AllReviews = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Tất cả đánh giá
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Danh sách tất cả đánh giá - Hiển thị đánh giá và bình luận của khách hàng
        về homestay, bao gồm điểm số và nội dung chi tiết.
      </Typography>
    </Paper>
  </Box>
);

const ReviewModeration = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Kiểm duyệt nội dung
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Kiểm duyệt đánh giá - Xem xét nội dung đánh giá, ẩn hoặc báo cáo
        các nội dung vi phạm, không phù hợp hoặc spam.
      </Typography>
    </Paper>
  </Box>
);

const ReviewManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Tất cả đánh giá', path: '/dashboard/reviews', component: <AllReviews /> },
    { label: 'Kiểm duyệt', path: '/dashboard/reviews/moderation', component: <ReviewModeration /> },
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
            Quản lý Đánh giá
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý đánh giá của khách hàng và kiểm duyệt nội dung
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
              <Route path="/" element={<AllReviews />} />
              <Route path="moderation" element={<ReviewModeration />} />
              <Route path="*" element={<AllReviews />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default ReviewManagement;