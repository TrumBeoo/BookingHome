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
} from '@mui/material';
import {
  Search,
  LocationOn,
  CalendarToday,
  People,
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
    // Implement search logic
  };

  const guestOptions = [
    { value: '1', label: '1 khách' },
    { value: '2', label: '2 khách' },
    { value: '3', label: '3 khách' },
    { value: '4', label: '4 khách' },
    { value: '5+', label: '5+ khách' },
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Điểm đến"
            variant="outlined"
            value={searchData.location}
            onChange={handleChange('location')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey.300',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Nhận phòng"
            variant="outlined"
            value={searchData.checkin}
            onChange={handleChange('checkin')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Trả phòng"
            variant="outlined"
            value={searchData.checkout}
            onChange={handleChange('checkout')}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            select
            label="Số khách"
            variant="outlined"
            value={searchData.guests}
            onChange={handleChange('guests')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <People color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {guestOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSearch}
            startIcon={<Search />}
            sx={{
              py: 1.8,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchBar;