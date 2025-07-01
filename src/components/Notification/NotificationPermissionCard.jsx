import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { Notifications, NotificationsOff, NotificationsActive, Close } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

export const NotificationPermissionCard = ({
  onPermissionGranted,
  showDismiss = true,
  compact = false,
}) => {
  const { permission, isSupported, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  if (!isSupported || permission === 'granted' || dismissed) {
    return null;
  }

  const handleRequest = async () => {
    setLoading(true);
    const granted = await requestPermission();
    setLoading(false);

    if (granted && onPermissionGranted) {
      onPermissionGranted();
    }
  };

  const getAlertSeverity = () => {
    switch (permission) {
      case 'denied':
        return 'error';
      case 'default':
        return 'info';
      default:
        return 'warning';
    }
  };

  const getIcon = () => {
    switch (permission) {
      case 'denied':
        return <NotificationsOff />;
      case 'granted':
        return <NotificationsActive />;
      default:
        return <Notifications />;
    }
  };

  if (compact) {
    return (
      <Alert
        severity={getAlertSeverity()}
        icon={getIcon()}
        sx={{
          zIndex: theme.zIndex.modal + 1,
          position: 'fixed',
          bottom: 16,
          right: 16,
          boxShadow: 3,
          minWidth: 300,
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {permission !== 'denied' && (
              <Button color='inherit' size='small' onClick={handleRequest} disabled={loading}>
                Enable
              </Button>
            )}
            {showDismiss && (
              <IconButton size='small' color='inherit' onClick={() => setDismissed(true)}>
                <Close fontSize='inherit' />
              </IconButton>
            )}
          </Box>
        }
      >
        {permission === 'denied'
          ? 'Notifications are blocked. Enable them in browser settings.'
          : 'Enable notifications to stay updated.'}
      </Alert>
    );
  }

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 3,
        zIndex: theme.zIndex.modal + 1,
        position: 'relative',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getIcon()}
          <Typography variant='subtitle1' sx={{ ml: 1 }}>
            Browser Notifications
          </Typography>
          <Chip
            label={permission}
            size='small'
            color={
              permission === 'granted' ? 'success' : permission === 'denied' ? 'error' : 'default'
            }
            sx={{ ml: 'auto' }}
          />
        </Box>
        <Typography variant='body2' color='text.secondary'>
          {permission === 'denied'
            ? 'Notifications are blocked. Enable them in your browser settings.'
            : 'Get real-time notifications for messages, reminders, and updates.'}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
        {permission !== 'denied' && (
          <Button
            variant='contained'
            size='small'
            startIcon={<Notifications fontSize='small' />}
            onClick={handleRequest}
            disabled={loading}
          >
            {loading ? 'Requesting...' : 'Enable'}
          </Button>
        )}
        {showDismiss && (
          <Button size='small' onClick={() => setDismissed(true)}>
            Dismiss
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
