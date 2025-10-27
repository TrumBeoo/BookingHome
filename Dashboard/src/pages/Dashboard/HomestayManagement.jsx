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
import HomestaysList from '../../components/HomestayManagement/HomestaysList';
import CreateHomestay from '../../components/HomestayManagement/CreateHomestay';
import EditHomestay from '../../components/HomestayManagement/EditHomestay';
import HomestayImages from '../../components/HomestayManagement/HomestayImages';
import HomestayCalendar from '../../components/HomestayManagement/HomestayCalendar';
import HomestayManagementMain from '../../components/HomestayManagement/HomestayManagement';

const HomestayManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Danh sách', path: '/dashboard/homestays' },
    { label: 'Thêm mới', path: '/dashboard/homestays/create' },
    { label: 'Quản lý chi tiết', path: '/dashboard/homestays/manage' },
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
            Quản lý Homestay
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý thông tin homestay, tiện ích, danh mục và lịch trống
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
              <Route path="/" element={<HomestaysList />} />
              <Route path="create" element={<CreateHomestay />} />
              <Route path="edit/:id" element={<EditHomestay />} />
              <Route path=":id/images" element={<HomestayImages />} />
              <Route path=":id/calendar" element={<HomestayCalendar />} />
              <Route path="manage" element={<HomestayManagementMain />} />
              <Route path="*" element={<HomestaysList />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default HomestayManagement;