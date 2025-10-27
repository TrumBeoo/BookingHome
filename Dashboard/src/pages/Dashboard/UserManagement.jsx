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
import CustomersList from '../../components/UserManagement/CustomersList';
import HostsList from '../../components/UserManagement/HostsList';
import PermissionsManagement from '../../components/UserManagement/PermissionsManagement';
import BlockedAccountsList from '../../components/UserManagement/BlockedAccountsList';

const UserManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Khách hàng', path: '/dashboard/users/customers', component: <CustomersList /> },
    { label: 'Host', path: '/dashboard/users/hosts', component: <HostsList /> },
    { label: 'Phân quyền', path: '/dashboard/users/permissions', component: <PermissionsManagement /> },
    { label: 'Tài khoản khóa', path: '/dashboard/users/blocked', component: <BlockedAccountsList /> },
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
            Quản lý người dùng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý thông tin khách hàng, host và phân quyền hệ thống
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
              <Route path="customers" element={<CustomersList />} />
              <Route path="hosts" element={<HostsList />} />
              <Route path="permissions" element={<PermissionsManagement />} />
              <Route path="blocked" element={<BlockedAccountsList />} />
              <Route path="*" element={<CustomersList />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default UserManagement;