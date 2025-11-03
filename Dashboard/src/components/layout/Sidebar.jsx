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
  Logout,
  ManageAccounts,
  Category,
  RateReview,
  AccountBalance,
  Receipt,
  Assessment,
  Article,
  Info,
  Build,
  Security,
  Api,
  SupervisorAccount,
  Block,
  Edit,
  Add,
  List as ListAltIcon,
  Schedule,
  Notifications,
  History,
  MonetizationOn,
  TrendingUp,
  Description,
  ContactSupport,
  QuestionAnswer,
  Web,
  Email,
  Phone,
  Campaign,
  LocalOffer,
  CalendarMonth,
  EventAvailable,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = React.useState({});

  const menuItems = [
    {
      title: 'Tổng quan',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      title: 'Quản lý người dùng',
      icon: <ManageAccounts />,
      submenu: [
        { title: 'Danh sách khách hàng', path: '/dashboard/users/customers', icon: <People /> },
        { title: 'Danh sách Host', path: '/dashboard/users/hosts', icon: <SupervisorAccount /> },
        { title: 'Phân quyền', path: '/dashboard/users/permissions', icon: <Security /> },
        { title: 'Tài khoản bị khóa', path: '/dashboard/users/blocked', icon: <Block /> },
      ],
    },
    {
      title: 'Quản lý Homestay',
      icon: <Home />,
      submenu: [
        { title: 'Danh sách Homestay', path: '/dashboard/homestays', icon: <ListAltIcon /> },
        { title: 'Thêm Homestay', path: '/dashboard/homestays/create', icon: <Add /> },
        { title: 'Quản lý tiện ích', path: '/dashboard/homestays/amenities', icon: <Build /> },
        { title: 'Danh mục Homestay', path: '/dashboard/homestays/categories', icon: <Category /> },
        { title: 'Quản lý loại phòng', path: '/dashboard/room-categories', icon: <Hotel /> },
        { title: 'Quản lý hình ảnh', path: '/dashboard/homestays/images', icon: <Edit /> },
        { title: 'Quản lý lịch trống', path: '/dashboard/homestays/availability', icon: <Schedule /> },
      ],
    },
    {
      title: 'Tình trạng Phòng',
      icon: <CalendarMonth />,
      submenu: [
        { title: 'Lịch phòng', path: '/dashboard/room-availability', icon: <EventAvailable /> },
        { title: 'Phòng đã đặt', path: '/dashboard/room-availability/booked', icon: <BookOnline /> },
        { title: 'Lịch trống', path: '/dashboard/room-availability/available', icon: <Schedule /> },
        { title: 'Tích hợp Calendar', path: '/dashboard/room-availability/integration', icon: <Campaign /> },
      ],
    },
    {
      title: 'Quản lý Đặt phòng',
      icon: <BookOnline />,
      submenu: [
        { title: 'Tất cả đặt phòng', path: '/dashboard/bookings', icon: <ListAltIcon /> },
        { title: 'Chờ xác nhận', path: '/dashboard/bookings/pending', icon: <Notifications /> },
        { title: 'Đã xác nhận', path: '/dashboard/bookings/confirmed', icon: <BookOnline /> },
        { title: 'Đã hủy', path: '/dashboard/bookings/cancelled', icon: <Block /> },
        { title: 'Lịch sử đặt phòng', path: '/dashboard/bookings/history', icon: <History /> },
      ],
    },
    {
      title: 'Quản lý Thanh toán',
      icon: <Payment />,
      submenu: [
        { title: 'Danh sách giao dịch', path: '/dashboard/payments/transactions', icon: <Receipt /> },
        { title: 'Trạng thái thanh toán', path: '/dashboard/payments/status', icon: <MonetizationOn /> },
        { title: 'Đối soát doanh thu', path: '/dashboard/payments/reconciliation', icon: <AccountBalance /> },
        { title: 'Báo cáo tài chính', path: '/dashboard/payments/reports', icon: <Assessment /> },
      ],
    },
    {
      title: 'Quản lý Đánh giá',
      icon: <RateReview />,
      submenu: [
        { title: 'Tất cả đánh giá', path: '/dashboard/reviews', icon: <Star /> },
        { title: 'Kiểm duyệt nội dung', path: '/dashboard/reviews/moderation', icon: <Edit /> },
      ],
    },

    {
      title: 'Quản lý Nội dung',
      icon: <Article />,
      submenu: [
        { title: 'Blog/Tin tức', path: '/dashboard/content/blog', icon: <Article /> },
        { title: 'Trang tĩnh', path: '/dashboard/content/pages', icon: <Web /> },
        { title: 'FAQ', path: '/dashboard/content/faq', icon: <QuestionAnswer /> },
      ],
    },
    {
      title: 'Thống kê & Báo cáo',
      icon: <BarChart />,
      submenu: [
        { title: 'Thống kê Homestay', path: '/dashboard/statistics/homestays', icon: <Home /> },
        { title: 'Thống kê Booking', path: '/dashboard/statistics/bookings', icon: <BookOnline /> },
        { title: 'Doanh thu tổng', path: '/dashboard/statistics/revenue', icon: <TrendingUp /> },
        { title: 'Biểu đồ doanh thu', path: '/dashboard/statistics/charts', icon: <BarChart /> },
      ],
    },
    {
      title: 'Hỗ trợ',
      icon: <Support />,
      submenu: [
        { title: 'Tin nhắn hỗ trợ', path: '/dashboard/support/messages', icon: <Email /> },
        { title: 'FAQ quản lý', path: '/dashboard/support/faq-management', icon: <QuestionAnswer /> },
        { title: 'Hướng dẫn sử dụng', path: '/dashboard/support/guides', icon: <Description /> },
      ],
    },
  ];

  const adminMenuItems = [
    {
      title: 'Hệ thống & Cấu hình',
      icon: <Settings />,
      submenu: [
        { title: 'Cài đặt Website', path: '/dashboard/system/website-settings', icon: <Web /> },
        { title: 'Quản lý API Key', path: '/dashboard/system/api-keys', icon: <Api /> },
        { title: 'Phân quyền hệ thống', path: '/dashboard/system/permissions', icon: <AdminPanelSettings /> },
        { title: 'Cấu hình thanh toán', path: '/dashboard/system/payment-config', icon: <Payment /> },
        { title: 'Thông tin liên hệ', path: '/dashboard/system/contact-info', icon: <ContactSupport /> },
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

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                  {subItem.icon && (
                    <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', minWidth: 36 }}>
                      {subItem.icon}
                    </ListItemIcon>
                  )}
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
        
        <ListItemButton
          onClick={handleLogout}
          sx={{ 
            color: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;