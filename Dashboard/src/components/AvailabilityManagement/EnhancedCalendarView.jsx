// Dashboard/src/components/AvailabilityManagement/EnhancedCalendarView.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  LinearProgress
} from '@mui/material';
import {
  Sync as SyncIcon,
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  CheckCircle,
  Error as ErrorIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import ApiService from '../../services/api';
import SimpleAvailabilityManager from './SimpleAvailabilityManager';

const EnhancedCalendarView = ({ homestay }) => {
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncConfig, setSyncConfig] = useState({
    provider: 'google',
    calendar_id: '',
    auto_block: true,
    sync_interval: 3600
  });
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncIntervalId, setSyncIntervalId] = useState(null);

  useEffect(() => {
    // Load saved sync config
    loadSyncConfig();
    
    return () => {
      if (syncIntervalId) {
        clearInterval(syncIntervalId);
      }
    };
  }, []);

  const loadSyncConfig = async () => {
    try {
      const response = await ApiService.get(`/api/homestays/${homestay.id}/sync-config`);
      if (response.config) {
        setSyncConfig(response.config);
        setAutoSyncEnabled(response.config.auto_sync);
      }
    } catch (error) {
      console.error('Failed to load sync config:', error);
    }
  };

  const handleSync = async () => {
    if (!syncConfig.calendar_id) {
      setSyncStatus({ type: 'error', message: 'Please enter Calendar ID' });
      return;
    }

    setSyncing(true);
    setSyncStatus(null);

    try {
      const response = await ApiService.post(
        `/api/availability/sync-calendar/${homestay.id}`,
        syncConfig
      );

      setSyncStatus({
        type: 'success',
        message: response.message,
        count: response.synced_count
      });

      // Refresh calendar view
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setSyncStatus({
        type: 'error',
        message: error.response?.data?.detail || 'Sync failed'
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoSyncToggle = (enabled) => {
    setAutoSyncEnabled(enabled);

    if (enabled) {
      // Start auto-sync interval
      const intervalId = setInterval(() => {
        handleSync();
      }, syncConfig.sync_interval * 1000);
      setSyncIntervalId(intervalId);
    } else {
      // Stop auto-sync
      if (syncIntervalId) {
        clearInterval(syncIntervalId);
        setSyncIntervalId(null);
      }
    }
  };

  const handleGoogleAuth = async () => {
    // Redirect to Google OAuth
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/calendar.readonly';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    window.location.href = authUrl;
  };

  return (
    <Box>
      {/* Sync Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Calendar Sync
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSyncEnabled}
                  onChange={(e) => handleAutoSyncToggle(e.target.checked)}
                  disabled={!syncConfig.calendar_id}
                />
              }
              label="Auto Sync"
            />
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setSyncDialogOpen(true)}
            >
              Configure
            </Button>
            <Button
              variant="contained"
              startIcon={syncing ? <LinearProgress /> : <SyncIcon />}
              onClick={handleSync}
              disabled={syncing || !syncConfig.calendar_id}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </Box>
        </Box>

        {syncStatus && (
          <Alert 
            severity={syncStatus.type} 
            sx={{ mt: 2 }}
            icon={syncStatus.type === 'success' ? <CheckCircle /> : <ErrorIcon />}
          >
            {syncStatus.message}
            {syncStatus.count && ` (${syncStatus.count} dates synced)`}
          </Alert>
        )}
      </Paper>

      {/* Calendar Manager */}
      <SimpleAvailabilityManager 
        homestay={homestay}
        showSnackbar={(message, severity) => {
          setSyncStatus({ type: severity, message });
        }}
      />

      {/* Sync Configuration Dialog */}
      <Dialog 
        open={syncDialogOpen} 
        onClose={() => setSyncDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Calendar Sync Configuration
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Provider Selection */}
            <FormControl fullWidth>
              <InputLabel>Calendar Provider</InputLabel>
              <Select
                value={syncConfig.provider}
                label="Calendar Provider"
                onChange={(e) => setSyncConfig({ ...syncConfig, provider: e.target.value })}
              >
                <MenuItem value="google">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GoogleIcon />
                    Google Calendar
                  </Box>
                </MenuItem>
                <MenuItem value="outlook">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MicrosoftIcon />
                    Microsoft Outlook
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Authorization */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Step 1: Authorize access to your calendar
              </Typography>
              <Button
                variant="outlined"
                startIcon={syncConfig.provider === 'google' ? <GoogleIcon /> : <MicrosoftIcon />}
                onClick={handleGoogleAuth}
                fullWidth
              >
                Connect {syncConfig.provider === 'google' ? 'Google' : 'Outlook'} Calendar
              </Button>
            </Box>

            {/* Calendar ID */}
            <TextField
              fullWidth
              label="Calendar ID"
              value={syncConfig.calendar_id}
              onChange={(e) => setSyncConfig({ ...syncConfig, calendar_id: e.target.value })}
              helperText="Enter your calendar ID (e.g., primary or specific calendar ID)"
              placeholder={syncConfig.provider === 'google' ? 'primary' : 'calendar-id@outlook.com'}
            />

            {/* Sync Options */}
            <FormControlLabel
              control={
                <Switch
                  checked={syncConfig.auto_block}
                  onChange={(e) => setSyncConfig({ ...syncConfig, auto_block: e.target.checked })}
                />
              }
              label="Automatically block dates from calendar events"
            />

            <FormControl fullWidth>
              <InputLabel>Sync Interval</InputLabel>
              <Select
                value={syncConfig.sync_interval}
                label="Sync Interval"
                onChange={(e) => setSyncConfig({ ...syncConfig, sync_interval: e.target.value })}
              >
                <MenuItem value={1800}>Every 30 minutes</MenuItem>
                <MenuItem value={3600}>Every hour</MenuItem>
                <MenuItem value={7200}>Every 2 hours</MenuItem>
                <MenuItem value={21600}>Every 6 hours</MenuItem>
                <MenuItem value={86400}>Daily</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info">
              <Typography variant="body2">
                Calendar sync will block dates in your homestay when events are found in your calendar.
                This helps prevent double bookings across platforms.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSyncDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setSyncDialogOpen(false);
              handleSync();
            }}
          >
            Save & Sync
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedCalendarView;