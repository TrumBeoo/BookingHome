import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Container,
  Badge,
} from '@mui/material';
import {
  Home,
  Menu as MenuIcon,
  AccountCircle,
  Login,
  PersonAdd,
  Dashboard,
  ExitToApp,
  Search,
  Favorite,
  Help,
  Language,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  // Navigation items accessible to all users
  const publicMenuItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Tìm homestay', path: '/search' },
    { label: 'Địa điểm', path: '/destinations' },
    { label: 'Về chúng tôi', path: '/about' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 280, pt: 2 }}>
        {/* Logo in mobile menu */}
        <Box sx={{ px: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Homestay Hub
          </Typography>
        </Box>

        <List>
          {publicMenuItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          ))}
          
          {/* Separator */}
          <Box sx={{ height: 1, bgcolor: 'divider', mx: 2, my: 1 }} />
          
          {!isAuthenticated ? (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
              >
                <Login sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Đăng nhập" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
              >
                <PersonAdd sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Đăng ký" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate('/host');
                  setMobileMenuOpen(false);
                }}
              >
                <Home sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Cho thuê homestay" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate('/bookings');
                  setMobileMenuOpen(false);
                }}
              >
                <Search sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Đặt phòng của tôi" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate('/favorites');
                  setMobileMenuOpen(false);
                }}
              >
                <Favorite sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Yêu thích" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText primary="Đăng xuất" />
              </ListItem>
            </>
          )}
          
          {/* Help and Support */}
          <Box sx={{ height: 1, bgcolor: 'divider', mx: 2, my: 1 }} />
          <ListItem
            button
            onClick={() => {
              navigate('/help');
              setMobileMenuOpen(false);
            }}
          >
            <Help sx={{ mr: 2, fontSize: 20 }} />
            <ListItemText primary="Trợ giúp" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: 'background.paper', 
          borderBottom: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer' 
              }}
              onClick={() => navigate('/')}
            >
              <Home sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Homestay Hub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {publicMenuItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      px: 2,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white',
                      }
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* User Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Host Your Home - Always visible */}
              {!isMobile && (
                <Button
                  variant="text"
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    }
                  }}
                  onClick={() => navigate('/host')}
                >
                  Cho thuê nhà
                </Button>
              )}

              {!isAuthenticated ? (
                !isMobile ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Login />}
                      onClick={() => navigate('/login')}
                      sx={{ 
                        color: 'text.primary', 
                        borderColor: 'grey.300',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                        }
                      }}
                    >
                      Đăng nhập
                    </Button>
                    {/*<Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => navigate('/signup')}
                      sx={{
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                        }
                      }}
                    >
                      Đăng ký
                    </Button>*/}
                  </>
                ) : null
              ) : (
                <>
                  {/* Notifications for authenticated users */}
                  {!isMobile && (
                    <>
                      <IconButton sx={{ color: 'text.primary' }}>
                        <Badge badgeContent={2} color="error">
                          <Favorite />
                        </Badge>
                      </IconButton>
                     
                    </>
                  )}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ color: 'text.primary' }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { minWidth: 200, mt: 1 }
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <AccountCircle sx={{ mr: 2 }} />
          Hồ sơ của tôi
        </MenuItem>
        <MenuItem onClick={() => { navigate('/bookings'); handleProfileMenuClose(); }}>
          <Search sx={{ mr: 2 }} />
          Đặt phòng của tôi
        </MenuItem>
        <MenuItem onClick={() => { navigate('/favorites'); handleProfileMenuClose(); }}>
          <Favorite sx={{ mr: 2 }} />
          Yêu thích
        </MenuItem>
        <MenuItem onClick={() => { navigate('/dashboard'); handleProfileMenuClose(); }}>
          <Dashboard sx={{ mr: 2 }} />
          Dashboard
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 2 }} />
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
};

export default Header;