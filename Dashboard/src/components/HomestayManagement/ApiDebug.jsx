import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import ApiService from '../../services/api';

const ApiDebug = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [homestayId, setHomestayId] = useState('1');

  const testEndpoints = [
    {
      name: 'GET Homestays',
      test: () => ApiService.getHomestays(),
      endpoint: '/dashboard/homestays'
    },
    {
      name: 'GET Homestay Calendar (old)',
      test: () => ApiService.request(`/dashboard/homestays/${homestayId}/calendar`),
      endpoint: `/dashboard/homestays/${homestayId}/calendar`
    },
    {
      name: 'GET Homestay Availability (new)',
      test: () => ApiService.getHomestayCalendar(homestayId),
      endpoint: `/dashboard/homestays/${homestayId}/availability`
    },
    {
      name: 'POST Calendar Entry',
      test: () => ApiService.addCalendarEntry(homestayId, {
        date: new Date().toISOString().split('T')[0],
        status: 'available',
        price: 1000000,
        min_nights: 1,
        max_nights: 7,
        notes: 'Test entry'
      }),
      endpoint: `/dashboard/homestays/${homestayId}/availability`
    },
    {
      name: 'GET Homestay Images',
      test: () => ApiService.getHomestayImages(homestayId),
      endpoint: `/dashboard/homestays/${homestayId}`
    }
  ];

  const runTest = async (testItem) => {
    setLoading(true);
    const testKey = testItem.name;
    
    try {
      console.log(`Testing: ${testItem.name}`);
      const result = await testItem.test();
      
      setResults(prev => ({
        ...prev,
        [testKey]: {
          success: true,
          data: result,
          endpoint: testItem.endpoint,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error(`Test failed: ${testItem.name}`, error);
      
      setResults(prev => ({
        ...prev,
        [testKey]: {
          success: false,
          error: {
            message: error.message,
            status: error.status,
            response: error.response
          },
          endpoint: testItem.endpoint,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults({});
    
    for (const testItem of testEndpoints) {
      await runTest(testItem);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        API Debug Tool
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Homestay ID"
              value={homestayId}
              onChange={(e) => setHomestayId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              onClick={runAllTests}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={20} /> : 'Test All Endpoints'}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={() => setResults({})}
              fullWidth
            >
              Clear Results
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {testEndpoints.map((testItem) => (
          <Grid item xs={12} md={6} key={testItem.name}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {testItem.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {testItem.endpoint}
              </Typography>
              
              <Button
                variant="outlined"
                onClick={() => runTest(testItem)}
                disabled={loading}
                fullWidth
                sx={{ mb: 2 }}
              >
                Test Endpoint
              </Button>
              
              {results[testItem.name] && (
                <Alert 
                  severity={results[testItem.name].success ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                >
                  {results[testItem.name].success 
                    ? 'Success' 
                    : `Error: ${results[testItem.name].error.message}`
                  }
                </Alert>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {Object.keys(results).length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Results
          </Typography>
          
          {Object.entries(results).map(([testName, result]) => (
            <Accordion key={testName}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>
                  {testName} - {result.success ? '✅ Success' : '❌ Failed'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="subtitle2">Endpoint:</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {result.endpoint}
                  </Typography>
                  
                  <Typography variant="subtitle2">Timestamp:</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                  
                  {result.success ? (
                    <>
                      <Typography variant="subtitle2">Response Data:</Typography>
                      <pre style={{ 
                        background: '#f5f5f5', 
                        padding: '10px', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '12px',
                        maxHeight: '300px'
                      }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2">Error Details:</Typography>
                      <pre style={{ 
                        background: '#ffebee', 
                        padding: '10px', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '12px',
                        color: '#c62828',
                        maxHeight: '300px'
                      }}>
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default ApiDebug;