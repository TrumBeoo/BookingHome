import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Campaign as CampaignIcon,
  Timer as TimerIcon,
  Repeat as RepeatIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const PopupManager = ({ popups, onAdd, onEdit, onDelete, onToggleActive }) => {
  const getDiscountIcon = (type) => {
    return type === 'percentage' ? <PercentIcon /> : <MoneyIcon />;
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      once_per_session: 'primary',
      once_per_day: 'secondary',
      always: 'warning',
      never: 'default'
    };
    return colors[frequency] || 'default';
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      once_per_session: 'Một lần/phiên',
      once_per_day: 'Một lần/ngày',
      always: 'Luôn hiển thị',
      never: 'Không hiển thị'
    };
    return labels[frequency] || frequency;
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Danh Sách Popup ({popups.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ borderRadius: 2 }}
        >
          Thêm Popup Mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        {popups.map((popup) => {
          const daysRemaining = getDaysRemaining(popup.end_date);
          const progressValue = daysRemaining > 0 ? Math.min((daysRemaining / 30) * 100, 100) : 0;
          
          return (
            <Grid item xs={12} md={6} lg={4} key={popup.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: popup.is_active ? '2px solid #4caf50' : '1px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <CampaignIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {popup.title}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={popup.is_active}
                          onChange={() => onToggleActive(popup.id, popup.is_active)}
                          size="small"
                        />
                      }
                      label=""
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {popup.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={getDiscountIcon(popup.discount_type)}
                      label={`${popup.discount_value}${popup.discount_type === 'percentage' ? '%' : 'đ'}`}
                      color="success"
                      size="small"
                    />
                    <Chip
                      icon={<RepeatIcon />}
                      label={getFrequencyLabel(popup.show_frequency)}
                      color={getFrequencyColor(popup.show_frequency)}
                      size="small"
                    />
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimerIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Hiển thị sau: {popup.trigger_delay / 1000}s
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Thời gian còn lại: {daysRemaining > 0 ? `${daysRemaining} ngày` : 'Đã hết hạn'}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{ 
                          mt: 1, 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: daysRemaining > 7 ? '#4caf50' : daysRemaining > 3 ? '#ff9800' : '#f44336'
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="caption" color="text.secondary" display="block">
                    Từ: {new Date(popup.start_date).toLocaleDateString('vi-VN')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Đến: {new Date(popup.end_date).toLocaleDateString('vi-VN')}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={popup.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
                      color={popup.is_active ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(popup)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onToggleActive(popup.id, popup.is_active)}
                      sx={{ color: popup.is_active ? 'warning.main' : 'success.main' }}
                    >
                      {popup.is_active ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(popup.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          );
        })}

        {popups.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có popup nào
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tạo popup đầu tiên để thu hút khách hàng với các ưu đãi hấp dẫn
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
              >
                Tạo Popup Đầu Tiên
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PopupManager;