import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Campaign as CampaignIcon,
  Image as ImageIcon,
  Timer as TimerIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const PromotionStats = ({ banners = [], popups = [] }) => {
  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.is_active).length;
  const totalPopups = popups.length;
  const activePopups = popups.filter(p => p.is_active).length;

  const stats = [
    {
      title: 'Tổng Banner',
      value: totalBanners,
      active: activeBanners,
      icon: <ImageIcon />,
      color: 'primary',
      progress: totalBanners > 0 ? (activeBanners / totalBanners) * 100 : 0
    },
    {
      title: 'Tổng Popup',
      value: totalPopups,
      active: activePopups,
      icon: <CampaignIcon />,
      color: 'secondary',
      progress: totalPopups > 0 ? (activePopups / totalPopups) * 100 : 0
    },
    {
      title: 'Lượt Xem Banner',
      value: '12.5K',
      active: '8.2K',
      icon: <VisibilityIcon />,
      color: 'success',
      progress: 65
    },
    {
      title: 'Tương Tác Popup',
      value: '3.2K',
      active: '1.8K',
      icon: <PeopleIcon />,
      color: 'warning',
      progress: 56
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Thống Kê Tổng Quan
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      bgcolor: `${stat.color}.light`,
                      color: `${stat.color}.main`,
                      mr: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip 
                    label={`${stat.active} hoạt động`}
                    size="small"
                    color={stat.color}
                    variant="outlined"
                  />
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{ 
                      flexGrow: 1, 
                      mr: 1, 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      [`& .MuiLinearProgress-bar`]: {
                        backgroundColor: `${stat.color}.main`
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(stat.progress)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PromotionStats;