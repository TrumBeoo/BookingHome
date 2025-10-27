import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider
} from '@mui/material';
import {
  Sync,
  SyncDisabled,
  Google,
  Microsoft,
  Settings,
  Delete,
  Add,
  CheckCircle,
  Error,
  Warning,
  Refresh
} from '@mui/icons-material';
import './CalendarIntegration.css';

const CalendarIntegration = ({ 
  integrations = [], 
  onConnect, 
  onDisconnect, 
  onSync, 
  onToggleAutoSync 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [syncStatus, setSyncStatus] = useState({});
  const [lastSync, setLastSync] = useState({});

  const providers = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: <Google />,
      color: '#4285f4',
      description: 'Đồng bộ với Google Calendar để quản lý lịch trống'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: <Microsoft />,
      color: '#0078d4',
      description: 'Tích hợp với Outlook Calendar'
    }
  ];

  useEffect(() => {
    // Load sync status for each integration
    integrations.forEach(integration => {
      loadSyncStatus(integration.id);
    });
  }, [integrations]);

  const loadSyncStatus = async (integrationId) => {
    try {
      // Simulate API call to get sync status
      const status = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: Math.random() > 0.7 ? 'error' : 'success',
            lastSync: new Date(Date.now() - Math.random() * 86400000),
            eventsCount: Math.floor(Math.random() * 50)
          });
        }, 1000);
      });
      
      setSyncStatus(prev => ({ ...prev, [integrationId]: status.status }));
      setLastSync(prev => ({ ...prev, [integrationId]: status.lastSync }));
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, [integrationId]: 'error' }));
    }
  };

  const handleConnect = async (provider) => {
    try {
      // Simulate OAuth flow
      const authUrl = `https://auth.${provider.id}.com/oauth/authorize?client_id=your_client_id&redirect_uri=your_redirect_uri`;
      
      // In real implementation, open OAuth popup
      const confirmed = window.confirm(
        `Bạn sẽ được chuyển hướng đến ${provider.name} để xác thực. Tiếp tục?`
      );
      
      if (confirmed && onConnect) {
        await onConnect(provider.id, {
          name: provider.name,
          provider: provider.id,
          connected_at: new Date().toISOString(),
          auto_sync: true,
          sync_interval: 3600 // 1 hour
        });
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async (integrationId) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn ngắt kết nối? Dữ liệu đồng bộ sẽ bị mất.');
    if (confirmed && onDisconnect) {
      await onDisconnect(integrationId);
    }
  };

  const handleManualSync = async (integrationId) => {
    setSyncStatus(prev => ({ ...prev, [integrationId]: 'syncing' }));
    try {
      if (onSync) {
        await onSync(integrationId);
      }
      setSyncStatus(prev => ({ ...prev, [integrationId]: 'success' }));
      setLastSync(prev => ({ ...prev, [integrationId]: new Date() }));
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, [integrationId]: 'error' }));
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'syncing':
        return <Sync className="rotating" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getSyncStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'syncing':
        return 'info';
      default:
        return 'warning';
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Chưa đồng bộ';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Tích hợp Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Kết nối Calendar
        </Button>
      </Box>

      {integrations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <SyncDisabled sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có tích hợp nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Kết nối với Google Calendar hoặc Outlook để đồng bộ lịch trống tự động
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Kết nối Calendar đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <List>
          {integrations.map((integration, index) => {
            const provider = providers.find(p => p.id === integration.provider);
            const status = syncStatus[integration.id] || 'unknown';
            
            return (
              <React.Fragment key={integration.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    {provider?.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {integration.name}
                        </Typography>
                        <Chip
                          icon={getSyncStatusIcon(status)}
                          label={status === 'syncing' ? 'Đang đồng bộ' : 
                                status === 'success' ? 'Hoạt động' :
                                status === 'error' ? 'Lỗi' : 'Chưa rõ'}
                          color={getSyncStatusColor(status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Lần đồng bộ cuối: {formatLastSync(lastSync[integration.id])}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={integration.auto_sync}
                              onChange={(e) => onToggleAutoSync && onToggleAutoSync(integration.id, e.target.checked)}
                              size="small"
                            />
                          }
                          label="Tự động đồng bộ"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleManualSync(integration.id)}
                        disabled={status === 'syncing'}
                        color="primary"
                      >
                        <Refresh />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDisconnect(integration.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < integrations.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}

      {/* Sync Status Alert */}
      {integrations.some(i => syncStatus[i.id] === 'error') && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Lỗi đồng bộ</AlertTitle>
          Một số calendar không thể đồng bộ. Vui lòng kiểm tra kết nối và thử lại.
        </Alert>
      )}

      {/* Connect Calendar Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Kết nối Calendar
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Chọn nhà cung cấp calendar để đồng bộ lịch trống tự động
          </Typography>
          
          <List>
            {providers.map((provider) => (
              <ListItem
                key={provider.id}
                button
                onClick={() => setSelectedProvider(provider)}
                selected={selectedProvider?.id === provider.id}
                sx={{ border: 1, borderColor: 'grey.300', mb: 1, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ color: provider.color }}>
                  {provider.icon}
                </ListItemIcon>
                <ListItemText
                  primary={provider.name}
                  secondary={provider.description}
                />
              </ListItem>
            ))}
          </List>

          {selectedProvider && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Lưu ý</AlertTitle>
              Bạn sẽ được chuyển hướng đến {selectedProvider.name} để xác thực. 
              Vui lòng đảm bảo bạn có quyền truy cập vào tài khoản calendar.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (selectedProvider) {
                handleConnect(selectedProvider);
                setOpenDialog(false);
                setSelectedProvider(null);
              }
            }}
            variant="contained"
            disabled={!selectedProvider}
          >
            Kết nối
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default CalendarIntegration;