import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  useMediaQuery,
  Typography,
  Chip,
  alpha,
  Fade,
  Grow,
} from '@mui/material';
import {
  Search,
  LocationOn,
  CalendarToday,
  People,
  TrendingUp,
  FilterList,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const SearchBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchData, setSearchData] = useState({
    location: '',
    checkin: '',
    checkout: '',
    guests: '2',
  });

  const handleChange = (field) => (event) => {
    setSearchData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSearch = () => {
    console.log('Search data:', searchData);
    // Navigate to search page with parameters
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.checkin) params.append('checkin', searchData.checkin);
    if (searchData.checkout) params.append('checkout', searchData.checkout);
    if (searchData.guests) params.append('guests', searchData.guests);
    
    window.location.href = `/search?${params.toString()}`;
  };

  const guestOptions = [
    { value: '1', label: '1 khách' },
    { value: '2', label: '2 khách' },
    { value: '3', label: '3 khách' },
    { value: '4', label: '4 khách' },
    { value: '5+', label: '5+ khách' },
  ];

  return (
    <Fade in timeout={800}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(30px)',
            border: '1px solid',
            borderColor: alpha('#ffffff', 0.4),
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            },
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' },
            },
          }}
        >
          {/* Compact Header */}
          <Box sx={{ mb: 2.5, textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: 0.5,
              }}
            >
              Tìm homestay hoàn hảo
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                maxWidth: 350,
                mx: 'auto',
              }}
            >
              Khám phá hàng ngàn homestay độc đáo với giá tốt nhất
            </Typography>
          </Box>

          {/* Modern Search Form */}
          <Grid container spacing={1.5} alignItems="end">
            <Grid item xs={12} md={3.5}>
              <TextField
                fullWidth
                placeholder="Điểm đến"
                variant="outlined"
                size="small"
                value={searchData.location}
                onChange={handleChange('location')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'primary.main', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: alpha('#f8f9fa', 0.8),
                    border: 'none',
                    '& fieldset': {
                      border: '1px solid',
                      borderColor: alpha('#e0e0e0', 0.6),
                    },
                    '&:hover': {
                      bgcolor: alpha('#f8f9fa', 1),
                      '& fieldset': {
                        borderColor: 'primary.light',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 1,
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.8,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={2.5}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                size="small"
                value={searchData.checkin}
                onChange={handleChange('checkin')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: 'primary.main', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: alpha('#f8f9fa', 0.8),
                    '& fieldset': {
                      border: '1px solid',
                      borderColor: alpha('#e0e0e0', 0.6),
                    },
                    '&:hover': {
                      bgcolor: alpha('#f8f9fa', 1),
                      '& fieldset': {
                        borderColor: 'primary.light',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 1,
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={2.5}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                size="small"
                value={searchData.checkout}
                onChange={handleChange('checkout')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: 'primary.main', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: alpha('#f8f9fa', 0.8),
                    '& fieldset': {
                      border: '1px solid',
                      borderColor: alpha('#e0e0e0', 0.6),
                    },
                    '&:hover': {
                      bgcolor: alpha('#f8f9fa', 1),
                      '& fieldset': {
                        borderColor: 'primary.light',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 1,
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={1.5}>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                value={searchData.guests}
                onChange={handleChange('guests')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People sx={{ color: 'primary.main', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: alpha('#f8f9fa', 0.8),
                    '& fieldset': {
                      border: '1px solid',
                      borderColor: alpha('#e0e0e0', 0.6),
                    },
                    '&:hover': {
                      bgcolor: alpha('#f8f9fa', 1),
                      '& fieldset': {
                        borderColor: 'primary.light',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      '& fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 1,
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  },
                }}
              >
                {guestOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                startIcon={<Search sx={{ fontSize: 20 }} />}
                sx={{
                  height: 48,
                  px: 2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>

          {/* Modern Quick Filters */}
          <Grow in timeout={1000}>
            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid', borderColor: alpha('#e0e0e0', 0.5) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                  }}
                >
                  Điểm đến phổ biến
                </Typography>
                <FilterList sx={{ color: 'text.secondary', fontSize: 18 }} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Sapa', 'Đà Lạt', 'Hội An', 'Phú Quốc', 'Mai Châu', 'Tam Đảo'].map((location, index) => (
                  <Grow in timeout={1200 + index * 100} key={location}>
                    <Chip
                      label={location}
                      variant="outlined"
                      clickable
                      onClick={() => setSearchData(prev => ({ ...prev, location }))}
                      sx={{
                        borderRadius: 2,
                        borderColor: alpha('#e0e0e0', 0.6),
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        height: 32,
                        bgcolor: alpha('#f8f9fa', 0.5),
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          bgcolor: alpha('#1976d2', 0.08),
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </Grow>
                ))}
              </Box>
            </Box>
          </Grow>
        </Paper>
      </Box>
    </Fade>
  );
};

export default SearchBar;