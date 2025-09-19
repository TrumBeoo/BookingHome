import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { dashboardTheme } from './theme/dashboardTheme';

// Import pages
import Overview from './pages/Dashboard/Overview';
import Properties from './pages/Dashboard/Properties';
import Bookings from './pages/Dashboard/Bookings';
import Analytics from './pages/Dashboard/Analytics';

function App() {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/properties" element={<Properties />} />
          <Route path="/dashboard/bookings" element={<Bookings />} />
          <Route path="/dashboard/bookings/pending" element={<Bookings />} />
          <Route path="/dashboard/bookings/confirmed" element={<Bookings />} />
          <Route path="/dashboard/bookings/cancelled" element={<Bookings />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;