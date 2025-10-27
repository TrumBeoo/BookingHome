import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Home,
  Category,
  PhotoLibrary,
  CalendarToday,
  Settings,
  Add,
  Edit,
  Delete,
  Save,
  Cancel
} from '@mui/icons-material';
import ApiService from '../../services/api';
import AmenityManager from './AmenityManager';
import CategoryManager from './CategoryManager';
import ImageManager from './ImageManager';
import CalendarManager from './CalendarManager';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HomestayManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [homestays, setHomestays] = useState([]);
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadHomestays();
  }, []);

  const loadHomestays = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getHomestays();
      const homestaysData = response.homestays || response.data || [];
      setHomestays(homestaysData);
    } catch (error) {
      showSnackbar('Không thể tải danh sách homestay', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleHomestaySelect = (homestay) => {
    setSelectedHomestay(homestay);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Homestay
      </Typography>

      {/* Homestay Selection */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chọn Homestay để quản lý
        </Typography>
        <Grid container spacing={2}>
          {loading ? (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : (
            homestays.map((homestay) => (
              <Grid item xs={12} sm={6} md={4} key={homestay.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedHomestay?.id === homestay.id ? 2 : 1,
                    borderColor: selectedHomestay?.id === homestay.id ? 'primary.main' : 'divider',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleHomestaySelect(homestay)}
                >
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {homestay.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {homestay.address || homestay.location}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={homestay.status} 
                        size="small" 
                        color={homestay.status === 'active' ? 'success' : 'default'}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>

      {selectedHomestay && (
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab 
                icon={<Settings />} 
                label="Tiện ích" 
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab 
                icon={<Category />} 
                label="Danh mục" 
                id="tab-1"
                aria-controls="tabpanel-1"
              />
              <Tab 
                icon={<PhotoLibrary />} 
                label="Hình ảnh" 
                id="tab-2"
                aria-controls="tabpanel-2"
              />
              <Tab 
                icon={<CalendarToday />} 
                label="Lịch trống" 
                id="tab-3"
                aria-controls="tabpanel-3"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <AmenityManager 
              homestay={selectedHomestay} 
              onUpdate={loadHomestays}
              showSnackbar={showSnackbar}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CategoryManager 
              homestay={selectedHomestay} 
              onUpdate={loadHomestays}
              showSnackbar={showSnackbar}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ImageManager 
              homestay={selectedHomestay} 
              onUpdate={loadHomestays}
              showSnackbar={showSnackbar}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <CalendarManager 
              homestay={selectedHomestay} 
              onUpdate={loadHomestays}
              showSnackbar={showSnackbar}
            />
          </TabPanel>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomestayManagement;