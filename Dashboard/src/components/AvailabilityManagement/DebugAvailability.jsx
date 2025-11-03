import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import ApiService from '../../services/api';

const DebugAvailability = () => {
  const [homestayId, setHomestayId] = useState('8');
  const [month, setMonth] = useState('10');
  const [year, setYear] = useState('2025');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test direct fetch call
      const response = await fetch(`http://localhost:8000/api/availability/quick/${homestayId}?month=${month}&year=${year}`);
      const data = await response.json();
      
      setResult({
        type: 'Direct Fetch',
        status: response.status,
        data: data
      });
    } catch (err) {
      setError(`Direct API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiService = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        month: month,
        year: year
      }).toString();
      
      const data = await ApiService.request(`/api/availability/quick/${homestayId}?${params}`);
      
      setResult({
        type: 'ApiService',
        status: 200,
        data: data
      });
    } catch (err) {
      setError(`ApiService Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testBlockDate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testDate = '2025-10-15';
      const data = await ApiService.request(`/api/availability/block-dates/${homestayId}`, {
        method: 'POST',
        body: JSON.stringify({
          dates: [testDate],
          room_ids: null
        })
      });
      
      setResult({
        type: 'Block Date',
        status: 200,
        data: data
      });
    } catch (err) {
      setError(`Block Date Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Debug Availability API
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Parameters
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Homestay ID"
            value={homestayId}
            onChange={(e) => setHomestayId(e.target.value)}
            size="small"
          />
          <TextField
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            size="small"
          />
          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={testDirectAPI}
            disabled={loading}
          >
            Test Direct API
          </Button>
          <Button
            variant="contained"
            onClick={testApiService}
            disabled={loading}
          >
            Test ApiService
          </Button>
          <Button
            variant="contained"
            onClick={testBlockDate}
            disabled={loading}
          >
            Test Block Date
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Result ({result.type}) - Status: {result.status}
          </Typography>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default DebugAvailability;