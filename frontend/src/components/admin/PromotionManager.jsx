import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import promotionService from '../../services/promotionService';

const PromotionManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_amount: '',
    max_uses: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    is_active: true,
    combo_type: 'none'
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await promotionService.getAllPromotions();
      setPromotions(data);
    } catch (error) {
      console.error('Error loading promotions:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPromotion) {
        await promotionService.updatePromotion(editingPromotion.id, formData);
      } else {
        await promotionService.createPromotion(formData);
      }
      
      loadPromotions();
      handleClose();
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        await promotionService.deletePromotion(id);
        loadPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      ...promotion,
      start_date: promotion.start_date.split('T')[0],
      end_date: promotion.end_date.split('T')[0]
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_amount: '',
      max_uses: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      is_active: true,
      combo_type: 'none'
    });
  };

  const generateCode = () => {
    const code = 'PROMO' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setFormData({ ...formData, code });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <OfferIcon color="primary" />
          Quản lý khuyến mãi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Tạo khuyến mãi
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên khuyến mãi</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Loại giảm giá</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đã sử dụng</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {promotion.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {promotion.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={promotion.code} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={promotion.discount_type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                    color={promotion.discount_type === 'percentage' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {promotion.discount_type === 'percentage' 
                    ? `${promotion.discount_value}%` 
                    : `${promotion.discount_value.toLocaleString()}đ`}
                </TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    {new Date(promotion.start_date).toLocaleDateString('vi-VN')}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={promotion.is_active ? 'Hoạt động' : 'Tạm dừng'}
                    color={promotion.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {promotion.used_count || 0} / {promotion.max_uses || '∞'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(promotion)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(promotion.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPromotion ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên khuyến mãi"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Mã khuyến mãi"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
                <Button variant="outlined" onClick={generateCode}>
                  Tạo mã
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá</InputLabel>
                <Select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  label="Loại giảm giá"
                >
                  <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                  <MenuItem value="fixed">Cố định (đ)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label={formData.discount_type === 'percentage' ? 'Giá trị (%)' : 'Giá trị (đ)'}
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Đơn tối thiểu (đ)"
                value={formData.min_amount}
                onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Số lần sử dụng tối đa"
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Ngày bắt đầu"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Ngày kết thúc"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại combo</InputLabel>
                <Select
                  value={formData.combo_type}
                  onChange={(e) => setFormData({ ...formData, combo_type: e.target.value })}
                  label="Loại combo"
                >
                  <MenuItem value="none">Không có combo</MenuItem>
                  <MenuItem value="multi_night">Combo nhiều đêm</MenuItem>
                  <MenuItem value="weekend">Combo cuối tuần</MenuItem>
                  <MenuItem value="holiday">Combo ngày lễ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="Kích hoạt khuyến mãi"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManager;