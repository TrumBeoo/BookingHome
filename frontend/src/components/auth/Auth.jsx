import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar
} from '@mui/material';
import { Home } from '@mui/icons-material';

const Auth = ({ children, title }) => {
  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Home sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Homestay Booking
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
              {title}
            </Typography>
            {children}
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Auth;