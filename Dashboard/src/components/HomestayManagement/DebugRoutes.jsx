import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Home,
  CalendarToday,
  PhotoLibrary,
  Edit,
  Add,
  Visibility,
} from '@mui/icons-material';

const DebugRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    {
      path: '/dashboard/homestays',
      name: 'Danh sách Homestay',
      icon: <Home />,
      description: 'Trang chính quản lý homestay'
    },
    {
      path: '/dashboard/homestays/create',
      name: 'Thêm Homestay',
      icon: <Add />,
      description: 'Form tạo homestay mới'
    },
    {
      path: '/dashboard/homestays/edit/1',
      name: 'Chỉnh sửa Homestay',
      icon: <Edit />,
      description: 'Form chỉnh sửa homestay (ID: 1)'
    },
    {
      path: '/dashboard/homestays/1/images',
      name: 'Quản lý hình ảnh',
      icon: <PhotoLibrary />,
      description: 'Quản lý hình ảnh homestay (ID: 1)'
    },
    {
      path: '/dashboard/homestays/1/calendar',
      name: 'Quản lý lịch',
      icon: <CalendarToday />,
      description: 'Quản lý lịch đặt phòng (ID: 1)'
    },
    {
      path: '/dashboard/homestays/test',
      name: 'Test Features',
      icon: <Visibility />,
      description: 'Trang test các tính năng'
    }
  ];

  const handleNavigate = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      alert(`Lỗi điều hướng: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Debug Routes - Homestay Management
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Current Route:</strong> {location.pathname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Search:</strong> {location.search || 'None'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Hash:</strong> {location.hash || 'None'}
        </Typography>
      </Paper>

      <Paper>
        <List>
          {routes.map((route, index) => (
            <React.Fragment key={route.path}>
              <ListItem>
                <ListItemIcon>
                  {route.icon}
                </ListItemIcon>
                <ListItemText
                  primary={route.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {route.description}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        {route.path}
                      </Typography>
                    </Box>
                  }
                />
                <Button
                  variant={location.pathname === route.path ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleNavigate(route.path)}
                  disabled={location.pathname === route.path}
                >
                  {location.pathname === route.path ? 'Current' : 'Navigate'}
                </Button>
              </ListItem>
              {index < routes.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Troubleshooting Tips
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>1. Kiểm tra Routes:</strong> Đảm bảo các routes đã được định nghĩa trong App.jsx hoặc router config
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>2. Kiểm tra Components:</strong> Đảm bảo các components (HomestayCalendar, HomestayImages) đã được import đúng
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>3. Kiểm tra API:</strong> Mở Developer Tools > Network để xem API calls
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>4. Kiểm tra Console:</strong> Mở Developer Tools > Console để xem lỗi JavaScript
        </Typography>
      </Paper>
    </Box>
  );
};

export default DebugRoutes;