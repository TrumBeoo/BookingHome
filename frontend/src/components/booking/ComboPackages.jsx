import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Skeleton
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  Restaurant as RestaurantIcon,
  DirectionsCar as CarIcon,
  Tour as TourIcon,
  Hotel as HotelIcon,
  Check as CheckIcon,
  Star as StarIcon
} from '@mui/icons-material';
import promotionService from '../../services/promotionService';

const ComboPackages = ({ 
  nights, 
  includesBreakfast, 
  onComboSelect,
  selectedCombo = null 
}) => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedComboDetails, setSelectedComboDetails] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCombos();
  }, [nights, includesBreakfast]);

  const fetchCombos = async () => {
    setLoading(true);
    setError('');

    try {
      const filters = {};
      if (nights) filters.min_nights = nights;
      if (includesBreakfast !== undefined) filters.includes_breakfast = includesBreakfast;

      const data = await promotionService.getComboPackages(filters);
      setCombos(data);
    } catch (error) {
      console.error('Error fetching combos:', error);
      setError('Không thể tải combo packages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (combo) => {
    setSelectedComboDetails(combo);
    setDialogOpen(true);
  };

  const handleSelectCombo = (combo) => {
    onComboSelect && onComboSelect(combo);
    setDialogOpen(false);
  };

  const getComboFeatures = (combo) => {
    const features = [];
    if (combo.includes_breakfast) features.push({ icon: <RestaurantIcon />, text: 'Ăn sáng miễn phí' });
    if (combo.includes_transport) features.push({ icon: <CarIcon />, text: 'Đưa đón sân bay' });
    if (combo.includes_tour) features.push({ icon: <TourIcon />, text: 'Tour tham quan' });
    return features;
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[1, 2].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (combos.length === 0) {
    return null;
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <OfferIcon color="primary" />
            Combo tiết kiệm ({combos.length} gói)
          </Typography>

          <Grid container spacing={2}>
            {combos.map((combo) => (
              <Grid item xs={12} md={6} key={combo.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    border: selectedCombo?.id === combo.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    backgroundColor: selectedCombo?.id === combo.id ? '#f3f8ff' : 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {combo.name}
                      </Typography>
                      {combo.savings && (
                        <Chip 
                          label={`Tiết kiệm ${promotionService.formatPrice(combo.savings)}`}
                          color="success"
                          size="small"
                          icon={<StarIcon />}
                        />
                      )}
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {combo.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ mb: 2 }}>
                      {getComboFeatures(combo).map((feature, index) => (
                        <Chip
                          key={index}
                          icon={feature.icon}
                          label={feature.text}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>

                    {/* Pricing */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        Giá gốc: {promotionService.formatPrice(combo.original_price)}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        Giá combo: {promotionService.formatPrice(combo.combo_price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Từ {combo.min_nights} đêm trở lên
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(combo)}
                      sx={{ mr: 1 }}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant={selectedCombo?.id === combo.id ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleSelectCombo(combo)}
                      startIcon={selectedCombo?.id === combo.id ? <CheckIcon /> : null}
                    >
                      {selectedCombo?.id === combo.id ? 'Đã chọn' : 'Chọn combo'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedCombo && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Đã chọn combo "{selectedCombo.name}" - Tiết kiệm {promotionService.formatPrice(selectedCombo.savings)}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog chi tiết combo */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedComboDetails && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedComboDetails.name}</Typography>
                <Chip 
                  label={`Tiết kiệm ${promotionService.formatPrice(selectedComboDetails.savings)}`}
                  color="success"
                  icon={<StarIcon />}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedComboDetails.description}
              </Typography>

              <Grid container spacing={3}>
                {/* Giá cả */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Giá cả</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Giá gốc"
                            secondary={promotionService.formatPrice(selectedComboDetails.original_price)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Giá combo"
                            secondary={
                              <Typography variant="h6" color="primary">
                                {promotionService.formatPrice(selectedComboDetails.combo_price)}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Tiết kiệm"
                            secondary={
                              <Typography variant="body2" color="success.main">
                                {promotionService.formatPrice(selectedComboDetails.savings)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Dịch vụ bao gồm */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>Dịch vụ bao gồm</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <HotelIcon color={selectedComboDetails.min_nights ? "primary" : "disabled"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`Từ ${selectedComboDetails.min_nights} đêm trở lên`}
                          />
                        </ListItem>
                        
                        <ListItem>
                          <ListItemIcon>
                            <RestaurantIcon color={selectedComboDetails.includes_breakfast ? "primary" : "disabled"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Ăn sáng"
                            secondary={selectedComboDetails.includes_breakfast ? "Có" : "Không"}
                          />
                        </ListItem>
                        
                        <ListItem>
                          <ListItemIcon>
                            <CarIcon color={selectedComboDetails.includes_transport ? "primary" : "disabled"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Đưa đón sân bay"
                            secondary={selectedComboDetails.includes_transport ? "Có" : "Không"}
                          />
                        </ListItem>
                        
                        <ListItem>
                          <ListItemIcon>
                            <TourIcon color={selectedComboDetails.includes_tour ? "primary" : "disabled"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Tour tham quan"
                            secondary={selectedComboDetails.includes_tour ? "Có" : "Không"}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Đóng
              </Button>
              <Button 
                variant="contained" 
                onClick={() => handleSelectCombo(selectedComboDetails)}
                startIcon={selectedCombo?.id === selectedComboDetails.id ? <CheckIcon /> : null}
              >
                {selectedCombo?.id === selectedComboDetails.id ? 'Đã chọn' : 'Chọn combo này'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ComboPackages;