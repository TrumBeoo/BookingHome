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

// Placeholder components for support sections
const SupportMessages = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Tin nhắn hỗ trợ
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý tin nhắn hỗ trợ - Nhận và trả lời các yêu cầu hỗ trợ
        từ khách hàng và host, theo dõi trạng thái xử lý.
      </Typography>
    </Paper>
  </Box>
);

const FAQManagement = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Quản lý FAQ
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý câu hỏi thường gặp - Tạo và cập nhật các câu hỏi
        thường gặp để giúp khách hàng tự giải quyết vấn đề.
      </Typography>
    </Paper>
  </Box>
);

const UserGuides = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Hướng dẫn sử dụng
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Tạo hướng dẫn sử dụng - Viết và cập nhật các hướng dẫn
        chi tiết cho khách hàng và host sử dụng hệ thống.
      </Typography>
    </Paper>
  </Box>
);

const Support = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Tin nhắn', path: '/dashboard/support/messages', component: <SupportMessages /> },
    { label: 'FAQ', path: '/dashboard/support/faq-management', component: <FAQManagement /> },
    { label: 'Hướng dẫn', path: '/dashboard/support/guides', component: <UserGuides /> },
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
            Hỗ trợ khách hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý hỗ trợ khách hàng và tài liệu hướng dẫn
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
              <Route path="messages" element={<SupportMessages />} />
              <Route path="faq-management" element={<FAQManagement />} />
              <Route path="guides" element={<UserGuides />} />
              <Route path="*" element={<SupportMessages />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default Support;