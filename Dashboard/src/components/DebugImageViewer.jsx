import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { roomCategoriesAPI } from '../services/roomCategoriesAPI';

const DebugImageViewer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await roomCategoriesAPI.getCategories();
      setCategories(data);
      console.log('Categories data:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const testImageUrl = (url) => {
    const fullUrl = `http://localhost:8000${url}`;
    console.log('Testing image URL:', fullUrl);
    
    // Test bằng cách tạo img element
    const img = new Image();
    img.onload = () => console.log('✅ Image loaded successfully:', fullUrl);
    img.onerror = () => console.log('❌ Image failed to load:', fullUrl);
    img.src = fullUrl;
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Debug Image Viewer
      </Typography>
      
      {categories.map((category) => (
        <Card key={category.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{category.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {category.id}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Images Data:</Typography>
              <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px' }}>
                {JSON.stringify(category.images, null, 2)}
              </pre>
            </Box>
            
            {category.images && category.images.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Image Preview:</Typography>
                {category.images.map((image, index) => {
                  const fullUrl = `http://localhost:8000${image}`;
                  return (
                    <Box key={index} sx={{ mt: 1, p: 1, border: '1px solid #ddd' }}>
                      <Typography variant="body2">
                        Image {index + 1}: {image}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        Full URL: {fullUrl}
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={() => testImageUrl(image)}
                        sx={{ mt: 1 }}
                      >
                        Test Load
                      </Button>
                      <Box sx={{ mt: 1 }}>
                        <img 
                          src={fullUrl}
                          alt={`${category.name} - ${index + 1}`}
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '150px',
                            border: '1px solid #ccc'
                          }}
                          onLoad={() => console.log('Image loaded in preview:', fullUrl)}
                          onError={(e) => {
                            console.log('Image error in preview:', fullUrl);
                            e.target.style.border = '2px solid red';
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No images
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
      
      <Button onClick={loadCategories} variant="outlined" sx={{ mt: 2 }}>
        Reload Data
      </Button>
    </Box>
  );
};

export default DebugImageViewer;