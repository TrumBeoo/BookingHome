import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

const SimpleCalendarTest = () => {
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  const homestayId = 8;
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading availability data...');
      
      // Direct fetch call to test
      const response = await fetch(`http://localhost:8000/api/availability/quick/${homestayId}?month=${month}&year=${year}`);
      const data = await response.json();
      
      console.log('Raw API Response:', data);
      setRawResponse(data);
      
      if (data.availability) {
        setAvailabilityData(data.availability);
        console.log('Availability data set:', data.availability);
      } else {
        setError('No availability data in response');
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Generate days for current month
  const getDaysInMonth = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        data: availabilityData[dateStr] || null
      });
    }
    
    return days;
  };

  const days = getDaysInMonth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Simple Calendar Test
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6">
          {month}/{year} - Homestay {homestayId}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Reload'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {error}
        </Alert>
      )}

      {/* Debug Info */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" gutterBottom>
          Debug Info:
        </Typography>
        <Typography variant="body2">
          Availability Data Keys: {Object.keys(availabilityData).length}
        </Typography>
        <Typography variant="body2">
          Days Generated: {days.length}
        </Typography>
        <Typography variant="body2">
          Raw Response: {rawResponse ? 'Yes' : 'No'}
        </Typography>
      </Paper>

      {/* Simple Calendar Grid */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Calendar View
        </Typography>
        
        <Grid container spacing={1}>
          {days.map(({ day, dateStr, data }) => (
            <Grid item xs={12/7} key={dateStr}>
              <Card
                sx={{
                  minHeight: 60,
                  backgroundColor: data ? data.color + '20' : '#f0f0f0',
                  borderLeft: data ? `4px solid ${data.color}` : '4px solid #ccc'
                }}
              >
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {day}
                  </Typography>
                  <Typography variant="caption">
                    {data ? data.status : 'no data'}
                  </Typography>
                  {data && (
                    <Typography variant="caption" display="block">
                      Rooms: {data.available_rooms}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Raw Data Display */}
      {rawResponse && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Raw API Response (First 5 entries):
          </Typography>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px',
            fontSize: '12px'
          }}>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(rawResponse.availability || {}).slice(0, 5)
              ), 
              null, 
              2
            )}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default SimpleCalendarTest;