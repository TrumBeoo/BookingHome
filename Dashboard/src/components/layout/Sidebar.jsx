import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  Home,
  People,
  BookOnline,
  BarChart,
  Settings,
  Help,
  ExpandLess,
  ExpandMore,
  Hotel,
  Star,
  Payment,
  Support,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = React.useState({});

  const menuItems = [
    {
      title: 'Tổng quan',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      title: 'Homestay',
      icon: <Home />,
      submenu: [
        { title: 'Danh sách', path: '/dashboard/properties' },
        { title: 'Thêm mới', path: '/dashboard/properties/create' },
        { title: 'Đánh giá', path: '/dashboard/reviews' },
      ],
    },
    {
      title: 'Đặt phòng',
      icon: <BookOnline />,
      submenu: [
        { title: 'Tất cả đặt phòng', path: '/dashboard/bookings' },
        { title: 'Chờ xác nhận', path: '/dashboard/bookings/pending' },
        { title: 'Đã xác nhận', path: '/dashboard/bookings/confirmed' },
        { title: 'Đã hủy', path: '/dashboard/bookings/cancelled' },
      ],
    },
    {
      title: 'Khách hàng',
      icon: <People />,
      path: '/dashboard/customers',
    },
    {
      title: 'Doanh thu',
      icon: <Payment />,
      submenu: [
        { title: 'Tổng quan', path: '/dashboard/revenue' },
        { title: 'Báo cáo', path: '/dashboard/revenue/reports' },
        { title: 'Thanh toán', path: '/dashboard/payments' },
      ],
    },
    {
      title: 'Phân tích',
      icon: <BarChart />,
      path: '/dashboard/analytics',
    },
    {
      title: 'Hỗ trợ',
      icon: <Support />,
      submenu: [
        { title: 'Tin nhắn', path: '/dashboard/support/messages' },
        { title: 'FAQ', path: '/dashboard/support/faq' },
      ],
    },
  ];

  const adminMenuItems = [
    {
      title: 'Quản trị',
      icon: <AdminPanelSettings />,
      submenu: [
        { title: 'Người dùng', path: '/dashboard/admin/users' },
        { title: 'Cài đặt', path: '/dashboard/admin/settings' },
      ],
    },
  ];

  const handleSubmenuToggle = (title) => {
    setOpenSubmenu(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  const renderMenuItem = (item, isAdmin = false) => {
    if (item.submenu) {
      return (
        <Box key={item.title}>
          <ListItemButton
            onClick={() => handleSubmenuToggle(item.title)}
            sx={{ 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
            {openSubmenu[item.title] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu[item.title]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.submenu.map((subItem) => (
                <ListItemButton
                  key={subItem.path}
                  sx={{ 
                    pl: 4,
                    color: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: isActive(subItem.path) ? 'primary.main' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => handleNavigate(subItem.path)}
                >
                  <ListItemText primary={subItem.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItemButton
        key={item.title}
        selected={isActive(item.path)}
        onClick={() => handleNavigate(item.path)}
        sx={{ 
          color: 'white',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
          <Home sx={{ mr: 1, verticalAlign: 'middle' }} />
          Homestay Hub
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Dashboard
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {menuItems.map(renderMenuItem)}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Admin Menu */}
        <List>
          <ListItem>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              QUẢN TRỊ
            </Typography>
          </ListItem>
          {adminMenuItems.map(item => renderMenuItem(item, true))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <ListItemButton
          sx={{ 
            color: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
            <Help />
          </ListItemIcon>
          <ListItemText primary="Trợ giúp" />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;