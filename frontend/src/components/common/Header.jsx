import React, { useState, useEffect } from 'react';
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
  Divider,
  alpha,
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
  Phone,
  Email,
  LocationOn,
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Loại phòng', path: '/room-categories' },
    { label: 'Địa điểm', path: '/destinations' },
    { label: 'Blog', path: '/blog' },
    { label: 'Liên hệ', path: '/contact' },
    { label: 'Về chúng tôi', path: '/about' },
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
            Homi
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
      {/* Top Contact Bar */}
      {!isMobile && (
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 1,
            fontSize: '0.875rem',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'inherit' }}>
                    0912345678
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Email sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: 'inherit' }}>
                    homi@gmail.com
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  Phục vụ 24/24 - Đặt phòng homestay uy tín
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      <AppBar 
        position="sticky" 
        elevation={scrolled ? 2 : 0}
        sx={{ 
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'background.paper',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? 'none' : '1px solid',
          borderColor: 'grey.200',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 1, md: 1.5 } }}>
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                }}
              >
                <Home sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800, 
                    color: 'text.primary',
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1,
                  }}
                >
                  Homi
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  Homestay
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {publicMenuItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      position: 'relative',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                        transform: 'translateY(-1px)',
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: 0,
                        height: '2px',
                        bgcolor: 'primary.main',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)',
                      },
                      '&:hover:before': {
                        width: '80%',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* User Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Host Your Home - Always visible */}
              {/*{!isMobile && (
                <Button
                  variant="text"
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.08),
                      color: 'secondary.main',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => navigate('/host')}
                >
                  Cho thuê homestay
                </Button>
              )}*/}

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
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Đăng nhập
                    </Button>
                    {/*<Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => navigate('/signup')}
                      sx={{
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
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
                      <IconButton 
                        sx={{ 
                          color: 'text.primary',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            color: 'error.main',
                          },
                        }}
                      >
                        <Badge badgeContent={2} color="error">
                          <Favorite />
                        </Badge>
                      </IconButton>
                     
                    </>
                  )}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ 
                      color: 'text.primary',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'primary.main',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        fontWeight: 600,
                      }}
                    >
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
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