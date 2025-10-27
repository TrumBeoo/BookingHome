import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Campaign as CampaignIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import BannerManager from './BannerManager';
import PopupManager from './PopupManager';
import PromotionForm from './PromotionForm';
import PromotionStats from './PromotionStats';

const PromotionDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [banners, setBanners] = useState([]);
  const [popups, setPopups] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('banner');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      // Load banners and popups from API
      const bannersData = [
        {
          id: 1,
          title: 'Banner Giảm Giá Mùa Thu',
          description: 'Giảm 30% cho tất cả homestay',
          image: '/images/banner1.jpg',
          discount_value: 30,
          discount_type: 'percentage',
          is_active: true,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          position: 'hero'
        }
      ];
      
      const popupsData = [
        {
          id: 1,
          title: 'Popup Khuyến Mãi Đặc Biệt',
          description: 'Ưu đãi 50% cho khách hàng mới',
          discount_value: 50,
          discount_type: 'percentage',
          is_active: true,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          trigger_delay: 3000,
          show_frequency: 'once_per_session'
        }
      ];

      setBanners(bannersData);
      setPopups(popupsData);
    } catch (error) {
      showSnackbar('Lỗi khi tải dữ liệu', 'error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddNew = (type) => {
    setFormType(type);
    setEditingItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item, type) => {
    setFormType(type);
    setEditingItem(item);
    setOpenForm(true);
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'banner') {
        setBanners(banners.filter(b => b.id !== id));
      } else {
        setPopups(popups.filter(p => p.id !== id));
      }
      showSnackbar('Xóa thành công', 'success');
    } catch (error) {
      showSnackbar('Lỗi khi xóa', 'error');
    }
  };

  const handleToggleActive = async (id, type, currentStatus) => {
    try {
      if (type === 'banner') {
        setBanners(banners.map(b => 
          b.id === id ? { ...b, is_active: !currentStatus } : b
        ));
      } else {
        setPopups(popups.map(p => 
          p.id === id ? { ...p, is_active: !currentStatus } : p
        ));
      }
      showSnackbar('Cập nhật trạng thái thành công', 'success');
    } catch (error) {
      showSnackbar('Lỗi khi cập nhật', 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        // Update existing
        if (formType === 'banner') {
          setBanners(banners.map(b => 
            b.id === editingItem.id ? { ...data, id: editingItem.id } : b
          ));
        } else {
          setPopups(popups.map(p => 
            p.id === editingItem.id ? { ...data, id: editingItem.id } : p
          ));
        }
        showSnackbar('Cập nhật thành công', 'success');
      } else {
        // Create new
        const newItem = { ...data, id: Date.now() };
        if (formType === 'banner') {
          setBanners([...banners, newItem]);
        } else {
          setPopups([...popups, newItem]);
        }
        showSnackbar('Tạo mới thành công', 'success');
      }
      setOpenForm(false);
    } catch (error) {
      showSnackbar('Lỗi khi lưu', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          <CampaignIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Quản Lý Khuyến Mãi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý banner giảm giá và popup khuyến mãi cho website
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            icon={<ImageIcon />} 
            label="Banner Giảm Giá" 
            iconPosition="start"
          />
          <Tab 
            icon={<CampaignIcon />} 
            label="Popup Khuyến Mãi" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <PromotionStats banners={banners} popups={popups} />

      {activeTab === 0 && (
        <BannerManager
          banners={banners}
          onAdd={() => handleAddNew('banner')}
          onEdit={(item) => handleEdit(item, 'banner')}
          onDelete={(id) => handleDelete(id, 'banner')}
          onToggleActive={(id, status) => handleToggleActive(id, 'banner', status)}
        />
      )}

      {activeTab === 1 && (
        <PopupManager
          popups={popups}
          onAdd={() => handleAddNew('popup')}
          onEdit={(item) => handleEdit(item, 'popup')}
          onDelete={(id) => handleDelete(id, 'popup')}
          onToggleActive={(id, status) => handleToggleActive(id, 'popup', status)}
        />
      )}

      <PromotionForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        type={formType}
        initialData={editingItem}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PromotionDashboard;