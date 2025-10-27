import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PromotionDashboard from '../../components/PromotionManagement/PromotionDashboard';

const PromotionManagement = () => {
  return (
    <DashboardLayout>
      <PromotionDashboard />
    </DashboardLayout>
  );
};

export default PromotionManagement;