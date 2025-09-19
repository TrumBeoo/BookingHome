import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
          p={3}
        >
          <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
            <Typography variant="h6" gutterBottom>
              Đã xảy ra lỗi không mong muốn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ứng dụng đã gặp lỗi. Vui lòng tải lại trang hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </Typography>
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleReload}
            sx={{ mt: 2 }}
          >
            Tải lại trang
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;