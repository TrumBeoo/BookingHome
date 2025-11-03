import React, { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';

const QuickTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBlock = async () => {
    setLoading(true);
    try {
      // Block ngày 26/11
      const blockRes = await axios.post('http://localhost:8000/api/availability/block-dates/8', {
        dates: ['2024-11-26'],
        room_ids: null
      });
      
      // Lấy dữ liệu để kiểm tra
      const getRes = await axios.get('http://localhost:8000/api/availability/quick/8', {
        params: { month: 11, year: 2024 }
      });
      
      const day26 = getRes.data.availability['2024-11-26'];
      
      setResult(`Block: ${blockRes.data.message}\nNgày 26/11: ${day26?.status} - ${day26?.tooltip}`);
    } catch (error) {
      setResult(`Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  const testUnblock = async () => {
    setLoading(true);
    try {
      // Unblock ngày 26/11
      const unblockRes = await axios.post('http://localhost:8000/api/availability/unblock-dates/8', {
        dates: ['2024-11-26'],
        room_ids: null
      });
      
      // Lấy dữ liệu để kiểm tra
      const getRes = await axios.get('http://localhost:8000/api/availability/quick/8', {
        params: { month: 11, year: 2024 }
      });
      
      const day26 = getRes.data.availability['2024-11-26'];
      
      setResult(`Unblock: ${unblockRes.data.message}\nNgày 26/11: ${day26?.status} - ${day26?.tooltip}`);
    } catch (error) {
      setResult(`Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Test Nhanh API</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="error" onClick={testBlock} disabled={loading}>
          Chặn 26/11
        </Button>
        <Button variant="contained" color="success" onClick={testUnblock} disabled={loading}>
          Bỏ chặn 26/11
        </Button>
      </Box>
      
      {result && (
        <Alert severity="info">
          <pre>{result}</pre>
        </Alert>
      )}
    </Box>
  );
};

export default QuickTest;