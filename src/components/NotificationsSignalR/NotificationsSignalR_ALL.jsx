import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Link,
  IconButton,
  Toolbar,
  AppBar,
  CircularProgress,
  Alert,
  Fab,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Circle as CircleIcon,
  Language as SystemIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  MarkEmailRead as MarkAllReadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import Message from '../messages/Message';
import ErrorMessage from '../messages/ErrorMessage';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';

function NotificationsList() {
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    isConnected,
    notificationsLoading,
    notificationsError,
  } = useNotifications();
  const navigateTo = useNavigate();

  const handleBack = () => {
    navigateTo(-1);
  };

  const handleRefresh = () => {
    console.log('Refreshing notifications...');
    setRefreshKey((prev) => prev + 1); // this forces re-render
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await markNotificationAsRead(notification.notificationId);
    }

    // Navigate to action URL if provided
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  const getSenderIcon = (senderType) => {
    switch (senderType?.toLowerCase()) {
      case 'system':
        return <SystemIcon />;
      case 'user':
        return <PersonIcon />;
      case 'business':
      case 'company':
        return <BusinessIcon />;
      default:
        return <SystemIcon />;
    }
  };

  const getSenderColor = (senderType) => {
    switch (senderType?.toLowerCase()) {
      case 'system':
        return 'primary.main';
      case 'user':
        return 'success.main';
      case 'business':
      case 'company':
        return 'warning.main';
      default:
        return 'primary.main';
    }
  };

  const formatTime = (createdAt) => {
    const timestamp = new Date(createdAt);
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const formatFullDate = (createdAt) => {
    const timestamp = new Date(createdAt);
    return timestamp.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (notificationsLoading) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading notifications...
        </Typography>
      </Container>
    );
  }

  return (
    <Container key={refreshKey} maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <AppBar position='static' color='transparent' elevation={0} sx={{ mb: 3 }}>
        <Toolbar sx={{ px: 0 }}>
          <IconButton edge='start' onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant='h5' component='h1' sx={{ fontWeight: 'bold' }}>
              Notifications
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` • ${unreadCount} not read${unreadCount !== 1 ? 's' : ''}`}
            </Typography>
          </Box>
          <IconButton onClick={handleRefresh} disabled={notificationsLoading}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Error Alert */}
      <ErrorMessage errorMessage={notificationsError} />

      {/* Mark All as Read Button */}
      {unreadCount > 0 && (
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button
            variant='outlined'
            size='small'
            startIcon={<MarkAllReadIcon />}
            onClick={handleMarkAllAsRead}
            sx={{ textTransform: 'none' }}
          >
            Mark all as read ({unreadCount})
          </Button>
        </Box>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <NotificationsNoneIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant='h6' color='text.secondary' gutterBottom>
            No new notifications
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Your notifications will appear here when you receive them.
          </Typography>
        </Paper>
      ) : (
        <Paper key={refreshKey} sx={{ overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.notificationId}>
                <ListItem
                  alignItems='flex-start'
                  sx={{
                    backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                    cursor: notification.actionUrl ? 'pointer' : 'default',
                    py: 2,
                    px: 3,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    <ListItemAvatar sx={{ mr: 2 }}>
                      {notification.iconUrl ? (
                        <Avatar
                          src={notification.iconUrl}
                          sx={{ width: 48, height: 48 }}
                          alt='Notification icon'
                        />
                      ) : (
                        <Avatar
                          sx={{
                            bgcolor: getSenderColor(notification.senderType),
                            width: 48,
                            height: 48,
                          }}
                        >
                          {getSenderIcon(notification.senderType)}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <Typography
                          variant='subtitle1'
                          component='div'
                          sx={{
                            fontWeight: notification.isRead ? 'normal' : 'bold',
                            flex: 1,
                            lineHeight: 1.3,
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <CircleIcon sx={{ fontSize: 10, color: 'primary.main', mt: 0.5 }} />
                        )}
                      </Box>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        component='div'
                        sx={{
                          mb: 2,
                          lineHeight: 1.5,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant='caption' color='text.secondary' component='span'>
                            {formatTime(notification.createdAt)}
                          </Typography>
                          <Typography variant='caption' color='text.secondary' component='span'>
                            • {formatFullDate(notification.createdAt)}
                          </Typography>
                        </Box>
                        {notification.senderType && (
                          <Chip
                            label={notification.senderType}
                            size='small'
                            variant='outlined'
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                            }}
                          />
                        )}
                      </Box>
                      {notification.actionUrl && (
                        <Link
                          component='button'
                          variant='body2'
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(notification.actionUrl, '_blank');
                          }}
                          sx={{
                            mt: 1,
                            display: 'block',
                            textAlign: 'left',
                            fontWeight: 'medium',
                          }}
                        >
                          See details →
                        </Link>
                      )}
                    </Box>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Floating Action Button for Mark All Read (Mobile) */}
      {unreadCount > 0 && (
        <Fab
          color='primary'
          aria-label='mark all as read'
          onClick={handleMarkAllAsRead}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
        >
          <MarkAllReadIcon />
        </Fab>
      )}
    </Container>
  );
}

export default NotificationsList;
