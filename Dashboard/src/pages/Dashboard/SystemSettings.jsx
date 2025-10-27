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
import WebsiteSettings from '../../components/SystemSettings/WebsiteSettings';

const APIKeyManagement = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Quản lý API Key
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý API Key - Google Maps API, cổng thanh toán MoMo/VNPay,
        email service và các API key khác cần thiết cho hệ thống.
      </Typography>
    </Paper>
  </Box>
);

const SystemPermissions = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Phân quyền hệ thống
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý phân quyền hệ thống - Thiết lập quyền hạn cho Admin, Host, User
        và các vai trò khác trong hệ thống.
      </Typography>
    </Paper>
  </Box>
);

const PaymentConfig = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Cấu hình thanh toán
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Cấu hình cổng thanh toán - Thiết lập MoMo, VNPay, phí giao dịch,
        chính sách hoàn tiền và các cài đặt thanh toán khác.
      </Typography>
    </Paper>
  </Box>
);

const ContactInfo = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Thông tin liên hệ
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý thông tin liên hệ - Địa chỉ văn phòng, hotline,
        email hỗ trợ, giờ làm việc và các kênh liên hệ khác.
      </Typography>
    </Paper>
  </Box>
);

const SystemSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Website', path: '/dashboard/system/website-settings', component: <WebsiteSettings /> },
    { label: 'API Keys', path: '/dashboard/system/api-keys', component: <APIKeyManagement /> },
    { label: 'Phân quyền', path: '/dashboard/system/permissions', component: <SystemPermissions /> },
    { label: 'Thanh toán', path: '/dashboard/system/payment-config', component: <PaymentConfig /> },
    { label: 'Liên hệ', path: '/dashboard/system/contact-info', component: <ContactInfo /> },
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
            Hệ thống & Cấu hình
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cài đặt hệ thống, API keys và cấu hình chung
          </Typography>
        </Box>

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={currentTab >= 0 ? currentTab : 0}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="website-settings" element={<WebsiteSettings />} />
              <Route path="api-keys" element={<APIKeyManagement />} />
              <Route path="permissions" element={<SystemPermissions />} />
              <Route path="payment-config" element={<PaymentConfig />} />
              <Route path="contact-info" element={<ContactInfo />} />
              <Route path="*" element={<WebsiteSettings />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default SystemSettings;