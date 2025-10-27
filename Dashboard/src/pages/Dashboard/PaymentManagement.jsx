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
import TransactionsList from '../../components/PaymentManagement/TransactionsList';

const PaymentStatus = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Trạng thái thanh toán
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Quản lý trạng thái thanh toán - Chưa thanh toán, Đã thanh toán, Hoàn tiền.
        Cập nhật trạng thái và xử lý các vấn đề thanh toán.
      </Typography>
    </Paper>
  </Box>
);

const RevenueReconciliation = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Đối soát doanh thu
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Đối soát doanh thu theo tháng, quý, năm - So sánh doanh thu thực tế
        với dự kiến, phân tích sự chênh lệch và nguyên nhân.
      </Typography>
    </Paper>
  </Box>
);

const FinancialReports = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Báo cáo tài chính
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>
        Xuất báo cáo tài chính - Hóa đơn, báo cáo doanh thu,
        báo cáo lợi nhuận và các báo cáo tài chính khác.
      </Typography>
    </Paper>
  </Box>
);

const PaymentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Giao dịch', path: '/dashboard/payments/transactions', component: <TransactionsList /> },
    { label: 'Trạng thái', path: '/dashboard/payments/status', component: <PaymentStatus /> },
    { label: 'Đối soát', path: '/dashboard/payments/reconciliation', component: <RevenueReconciliation /> },
    { label: 'Báo cáo', path: '/dashboard/payments/reports', component: <FinancialReports /> },
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
            Quản lý Thanh toán
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý giao dịch, trạng thái thanh toán và báo cáo tài chính
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
              <Route path="transactions" element={<TransactionsList />} />
              <Route path="status" element={<PaymentStatus />} />
              <Route path="reconciliation" element={<RevenueReconciliation />} />
              <Route path="reports" element={<FinancialReports />} />
              <Route path="*" element={<TransactionsList />} />
            </Routes>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default PaymentManagement;