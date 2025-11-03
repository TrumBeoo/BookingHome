import React from 'react';
import { Box, Container } from '@mui/material';
import RoomAvailabilityManager from '../components/AvailabilityManagement/RoomAvailabilityManager';

const RoomAvailabilityPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <RoomAvailabilityManager />
    </Container>
  );
};

export default RoomAvailabilityPage;