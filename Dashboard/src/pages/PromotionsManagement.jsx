import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalOffer as CouponIcon,
  CardGiftcard as ComboIcon,
  TrendingUp as SeasonalIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const PromotionsManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [combos, setCombos] = useState([]);
  const [seasonalPricing, setSeasonalPricing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogType, setDialogType] = useState('promotion'); // 'promotion', 'combo', 'seasonal'

  // Form states
  const [formData, setFormData] = useState({
    // Promotion fields
    name: '',
    description: '',
    code: '',
    type: 'coupon',
    discount_type: 'percentage',
    discount_value: 0,
    max_discount: '',
    min_order_value: '',
    max_uses: '',
    max_uses_per_user: 1,
    start_date: new Date(),
    end_date: new Date(),
    is_active: true,
    
    // Combo fields
    original_price: 0,
    combo_price: 0,
    min_nights: 2,
    includes_breakfast: false,
    includes_transport: false,
    includes_tour: false,
    
    // Seasonal pricing fields
    price_multiplier: 1.0,
    fixed_surcharge: '',
    applies_to_weekends: false,
    applies_to_holidays: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch promotions
      const promotionsRes = await fetch('/api/promotions/');
      const promotionsData = await promotionsRes.json();
      setPromotions(promotionsData);

      // Fetch combos
      const combosRes = await fetch('/api/promotions/combos');
      const combosData = await combosRes.json();
      setCombos(combosData);

      // Fetch seasonal pricing
      const seasonalRes = await fetch('/api/admin/seasonal-pricing');
      if (seasonalRes.ok) {
        const seasonalData = await seasonalRes.json();
        setSeasonalPricing(seasonalData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    
    if (item) {
      setFormData({ ...item });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        code: '',
        type: 'coupon',
        discount_type: 'percentage',
        discount_value: 0,
        max_discount: '',
        min_order_value: '',
        max_uses: '',
        max_uses_per_user: 1,
        start_date: new Date(),
        end_date: new Date(),
        is_active: true,
        original_price: 0,
        combo_price: 0,
        min_nights: 2,
        includes_breakfast: false,
        includes_transport: false,
        includes_tour: false,
        price_multiplier: 1.0,
        fixed_surcharge: '',
        applies_to_weekends: false,
        applies_to_holidays: false
      });
    }
    
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      let url, method, payload;
      
      if (dialogType === 'promotion') {
        url = editingItem ? `/api/admin/promotions/${editingItem.id}` : '/api/admin/promotions';
        method = editingItem ? 'PUT' : 'POST';
        payload = {
          name: formData.name,
          description: formData.description,
          code: formData.code,
          type: formData.type,
          discount_type: formData.discount_type,
          discount_value: parseFloat(formData.discount_value),
          max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
          min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : null,
          max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
          max_uses_per_user: parseInt(formData.max_uses_per_user),
          start_date: formData.start_date.toISOString(),
          end_date: formData.end_date.toISOString(),
          is_active: formData.is_active
        };
      } else if (dialogType === 'combo') {
        url = editingItem ? `/api/admin/combos/${editingItem.id}` : '/api/admin/combos';
        method = editingItem ? 'PUT' : 'POST';
        payload = {
          name: formData.name,
          description: formData.description,
          original_price: parseFloat(formData.original_price),
          combo_price: parseFloat(formData.combo_price),
          savings: parseFloat(formData.original_price) - parseFloat(formData.combo_price),
          min_nights: parseInt(formData.min_nights),
          includes_breakfast: formData.includes_breakfast,
          includes_transport: formData.includes_transport,
          includes_tour: formData.includes_tour,
          valid_from: formData.start_date.toISOString(),
          valid_until: formData.end_date.toISOString(),
          is_active: formData.is_active
        };
      } else if (dialogType === 'seasonal') {
        url = editingItem ? `/api/admin/seasonal-pricing/${editingItem.id}` : '/api/admin/seasonal-pricing';
        method = editingItem ? 'PUT' : 'POST';
        payload = {
          name: formData.name,
          description: formData.description,
          start_date: formData.start_date.toISOString(),
          end_date: formData.end_date.toISOString(),
          price_multiplier: parseFloat(formData.price_multiplier),
          fixed_surcharge: formData.fixed_surcharge ? parseFloat(formData.fixed_surcharge) : null,
          applies_to_weekends: formData.applies_to_weekends,
          applies_to_holidays: formData.applies_to_holidays,
          is_active: formData.is_active
        };
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        handleCloseDialog();
        fetchData();
      } else {
        console.error('Error saving item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;

    try {
      let url;
      if (type === 'promotion') url = `/api/admin/promotions/${id}`;
      else if (type === 'combo') url = `/api/admin/combos/${id}`;
      else if (type === 'seasonal') url = `/api/admin/seasonal-pricing/${id}`;

      const response = await fetch(url, { method: 'DELETE' });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderPromotionsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Quản lý Khuyến mãi</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('promotion')}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Giảm giá</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>
                  <Chip label={promotion.code} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={promotion.type} 
                    color={promotion.type === 'coupon' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {promotion.discount_type === 'percentage' 
                    ? `${promotion.discount_value}%`
                    : formatPrice(promotion.discount_value)
                  }
                </TableCell>
                <TableCell>
                  {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={promotion.is_active ? 'Hoạt động' : 'Tạm dừng'}
                    color={promotion.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog('promotion', promotion)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete('promotion', promotion.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderCombosTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Quản lý Combo</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('combo')}
        >
          Thêm combo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {combos.map((combo) => (
          <Grid item xs={12} md={6} lg={4} key={combo.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {combo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {combo.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                    Giá gốc: {formatPrice(combo.original_price)}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Giá combo: {formatPrice(combo.combo_price)}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Tiết kiệm: {formatPrice(combo.savings)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {combo.includes_breakfast && <Chip label="Ăn sáng" size="small" sx={{ mr: 1, mb: 1 }} />}
                  {combo.includes_transport && <Chip label="Đưa đón" size="small" sx={{ mr: 1, mb: 1 }} />}
                  {combo.includes_tour && <Chip label="Tour" size="small" sx={{ mr: 1, mb: 1 }} />}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton onClick={() => handleOpenDialog('combo', combo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete('combo', combo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderSeasonalTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Quản lý Giá theo mùa</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('seasonal')}
        >
          Thêm giá mùa
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Hệ số nhân</TableCell>
              <TableCell>Phụ thu</TableCell>
              <TableCell>Áp dụng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seasonalPricing.map((pricing) => (
              <TableRow key={pricing.id}>
                <TableCell>{pricing.name}</TableCell>
                <TableCell>
                  {new Date(pricing.start_date).toLocaleDateString()} - {new Date(pricing.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>x{pricing.price_multiplier}</TableCell>
                <TableCell>
                  {pricing.fixed_surcharge ? formatPrice(pricing.fixed_surcharge) : '-'}
                </TableCell>
                <TableCell>
                  <Box>
                    {pricing.applies_to_weekends && <Chip label="Cuối tuần" size="small" sx={{ mr: 1, mb: 1 }} />}
                    {pricing.applies_to_holidays && <Chip label="Ngày lễ" size="small" sx={{ mr: 1, mb: 1 }} />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={pricing.is_active ? 'Hoạt động' : 'Tạm dừng'}
                    color={pricing.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog('seasonal', pricing)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete('seasonal', pricing.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderDialog = () => (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {
          dialogType === 'promotion' ? 'Khuyến mãi' :
          dialogType === 'combo' ? 'Combo' : 'Giá theo mùa'
        }
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Common fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>

            {/* Promotion specific fields */}
            {dialogType === 'promotion' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mã giảm giá"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Loại khuyến mãi</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <MenuItem value="coupon">Mã giảm giá</MenuItem>
                      <MenuItem value="automatic">Tự động</MenuItem>
                      <MenuItem value="combo">Combo</MenuItem>
                      <MenuItem value="seasonal">Theo mùa</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Loại giảm giá</InputLabel>
                    <Select
                      value={formData.discount_type}
                      onChange={(e) => handleInputChange('discount_type', e.target.value)}
                    >
                      <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                      <MenuItem value="fixed_amount">Số tiền cố định</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={formData.discount_type === 'percentage' ? 'Giảm giá (%)' : 'Giảm giá (VND)'}
                    value={formData.discount_value}
                    onChange={(e) => handleInputChange('discount_value', e.target.value)}
                  />
                </Grid>
                {formData.discount_type === 'percentage' && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Giảm tối đa (VND)"
                      value={formData.max_discount}
                      onChange={(e) => handleInputChange('max_discount', e.target.value)}
                    />
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Đơn hàng tối thiểu (VND)"
                    value={formData.min_order_value}
                    onChange={(e) => handleInputChange('min_order_value', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số lần sử dụng tối đa"
                    value={formData.max_uses}
                    onChange={(e) => handleInputChange('max_uses', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số lần sử dụng/người"
                    value={formData.max_uses_per_user}
                    onChange={(e) => handleInputChange('max_uses_per_user', e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* Combo specific fields */}
            {dialogType === 'combo' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Giá gốc (VND)"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Giá combo (VND)"
                    value={formData.combo_price}
                    onChange={(e) => handleInputChange('combo_price', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số đêm tối thiểu"
                    value={formData.min_nights}
                    onChange={(e) => handleInputChange('min_nights', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includes_breakfast}
                        onChange={(e) => handleInputChange('includes_breakfast', e.target.checked)}
                      />
                    }
                    label="Bao gồm ăn sáng"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includes_transport}
                        onChange={(e) => handleInputChange('includes_transport', e.target.checked)}
                      />
                    }
                    label="Bao gồm đưa đón"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includes_tour}
                        onChange={(e) => handleInputChange('includes_tour', e.target.checked)}
                      />
                    }
                    label="Bao gồm tour"
                  />
                </Grid>
              </>
            )}

            {/* Seasonal pricing specific fields */}
            {dialogType === 'seasonal' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    step="0.1"
                    label="Hệ số nhân giá"
                    value={formData.price_multiplier}
                    onChange={(e) => handleInputChange('price_multiplier', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Phụ thu cố định (VND)"
                    value={formData.fixed_surcharge}
                    onChange={(e) => handleInputChange('fixed_surcharge', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.applies_to_weekends}
                        onChange={(e) => handleInputChange('applies_to_weekends', e.target.checked)}
                      />
                    }
                    label="Áp dụng cuối tuần"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.applies_to_holidays}
                        onChange={(e) => handleInputChange('applies_to_holidays', e.target.checked)}
                      />
                    }
                    label="Áp dụng ngày lễ"
                  />
                </Grid>
              </>
            )}

            {/* Date fields */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.start_date}
                onChange={(date) => handleInputChange('start_date', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Ngày kết thúc"
                value={formData.end_date}
                onChange={(date) => handleInputChange('end_date', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            {/* Active status */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  />
                }
                label="Kích hoạt"
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editingItem ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quản lý Khuyến mãi & Giá cả
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<CouponIcon />} label="Khuyến mãi" />
        <Tab icon={<ComboIcon />} label="Combo Packages" />
        <Tab icon={<SeasonalIcon />} label="Giá theo mùa" />
      </Tabs>

      {tabValue === 0 && renderPromotionsTab()}
      {tabValue === 1 && renderCombosTab()}
      {tabValue === 2 && renderSeasonalTab()}

      {renderDialog()}
    </Box>
  );
};

export default PromotionsManagement;