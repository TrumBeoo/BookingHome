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
import BlogManagement from '../../components/ContentManagement/BlogManagement';

const StaticPages = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Quản lý trang tĩnh
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý các trang tĩnh - Giới thiệu, Liên hệ, Chính sách hủy,
        Điều khoản sử dụng và các trang thông tin khác.
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
        Quản lý câu hỏi thường gặp - Tạo, chỉnh sửa và tổ chức
        các câu hỏi thường gặp để hỗ trợ khách hàng tốt hơn.
      </Typography>
    </Paper>
  </Box>
);

const ContentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Blog/Tin tức', path: '/dashboard/content/blog', component: <BlogManagement /> },
    { label: 'Trang tĩnh', path: '/dashboard/content/pages', component: <StaticPages /> },
    { label: 'FAQ', path: '/dashboard/content/faq', component: <FAQManagement /> },
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
            Quản lý Nội dung
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý blog, trang tĩnh và nội dung hỗ trợ khách hàng
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
              <Route path="blog" element={<BlogManagement />} />
              <Route path="pages" element={<StaticPages />} />
              <Route path="faq" element={<FAQManagement />} />
              <Route path="*" element={<BlogManagement />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default ContentManagement;