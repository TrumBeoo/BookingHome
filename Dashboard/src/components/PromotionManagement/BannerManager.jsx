import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Image as ImageIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const BannerManager = ({ banners, onAdd, onEdit, onDelete, onToggleActive }) => {
  const getDiscountIcon = (type) => {
    return type === 'percentage' ? <PercentIcon /> : <MoneyIcon />;
  };

  const getPositionColor = (position) => {
    const colors = {
      hero: 'primary',
      sidebar: 'secondary',
      footer: 'info',
      popup: 'warning'
    };
    return colors[position] || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Danh Sách Banner ({banners.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ borderRadius: 2 }}
        >
          Thêm Banner Mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        {banners.map((banner) => (
          <Grid item xs={12} md={6} lg={4} key={banner.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={banner.image || '/images/placeholder-banner.jpg'}
                alt={banner.title}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                    {banner.title}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={banner.is_active}
                        onChange={() => onToggleActive(banner.id, banner.is_active)}
                        size="small"
                      />
                    }
                    label=""
                    sx={{ ml: 1 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {banner.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    icon={getDiscountIcon(banner.discount_type)}
                    label={`${banner.discount_value}${banner.discount_type === 'percentage' ? '%' : 'đ'}`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={banner.position}
                    color={getPositionColor(banner.position)}
                    size="small"
                  />
                  <Chip
                    label={banner.is_active ? 'Hoạt động' : 'Tạm dừng'}
                    color={banner.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary" display="block">
                  Từ: {new Date(banner.start_date).toLocaleDateString('vi-VN')}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Đến: {new Date(banner.end_date).toLocaleDateString('vi-VN')}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(banner)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onToggleActive(banner.id, banner.is_active)}
                    sx={{ color: banner.is_active ? 'warning.main' : 'success.main' }}
                  >
                    {banner.is_active ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(banner.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}

        {banners.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có banner nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tạo banner đầu tiên để bắt đầu quảng bá khuyến mãi
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
              >
                Tạo Banner Đầu Tiên
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BannerManager;