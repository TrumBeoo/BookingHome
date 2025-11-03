import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Alert, 
  Typography,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { Sync, CheckCircle, Error } from '@mui/icons-material';
import axios from 'axios';

const AvailabilitySync = () => {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testSync = async () => {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      // Test block một ngày
      const blockResponse = await axios.post('http://localhost:8000/api/availability/block-dates/8', {
        dates: ['2024-11-20'],
        room_ids: null
      });

      // Test lấy dữ liệu
      const getResponse = await axios.get('http://localhost:8000/api/availability/quick/8', {
        params: { month: 11, year: 2024 }
      });

      setResult({
        blocked: blockResponse.data,
        availability: getResponse.data
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Đồng Bộ Availability
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={syncing ? <CircularProgress size={20} /> : <Sync />}
            onClick={testSync}
            disabled={syncing}
          >
            {syncing ? 'Đang test...' : 'Test Đồng Bộ'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">Lỗi: {error}</Typography>
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              ✅ Đã block thành công: {result.blocked.message}
            </Typography>
            <Typography variant="body2">
              📅 Tổng ngày trong tháng 11: {Object.keys(result.availability.availability || {}).length}
            </Typography>
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary">
          Test này sẽ chặn ngày 20/11/2024 và kiểm tra dữ liệu availability
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySync;