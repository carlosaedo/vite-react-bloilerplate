import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Link,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Circle as CircleIcon,
  Language as SystemIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import torrestirApi from '../api/torrestirApi';

import connection from '../SignalR/connection';
import { useAuth } from '../context/AuthContext';

function NotificationsSignalR() {
  const { token } = useAuth();
  const navigateTo = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  useEffect(() => {
    async function fetchInitialNotifications() {
      try {
        const response = await torrestirApi.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const initialNotifications = response.data || [];
        setNotifications(initialNotifications);
        setUnreadCount(initialNotifications.filter((n) => !n.isRead).length);
        console.log('Initial notifications fetched:', initialNotifications);
      } catch (error) {
        console.error('Error fetching initial notifications:', error);
      }
    }

    fetchInitialNotifications();

    const startConnection = async () => {
      // Simple fix: only start if disconnected
      console.log('Current connection:', connection.state);
      if (connection.state === 'Disconnected') {
        try {
          await connection.start();
          console.log('SignalR connected');
          setIsConnected(true);
        } catch (err) {
          console.error('SignalR connection failed:', err);
          setIsConnected(false);
          setTimeout(() => {
            console.log('Retrying SignalR connection...');
            startConnection(); // retry again
          }, 10000);
        }
      }
    };

    startConnection();

    connection.on('ReceiveNotification', (notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    connection.onclose((err) => {
      console.error('Connection closed:', err?.message);
      setIsConnected(false);
    });

    connection.onreconnecting((err) => {
      console.warn('Reconnecting...', err?.message);
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      console.log('Reconnected!');
      setIsConnected(true);
    });

    return () => {
      connection.off('ReceiveNotification');
      connection.off('onclose');
      connection.off('onreconnecting');
      connection.off('onreconnected');
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeeAll = () => {
    navigateTo('/notifications');
    handleClose();
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.notificationId === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.notificationId);
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

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
  };

  // Get recent notifications for popover (max 5)
  const recentNotifications = notifications.slice(0, 5);

  return (
    <>
      <IconButton
        color='inherit'
        onClick={handleClick}
        aria-describedby={id}
        sx={{
          color: isConnected ? 'inherit' : 'text.disabled',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color='error'
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              minWidth: '18px',
              height: '18px',
            },
          }}
        >
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 400,
              maxHeight: 500,
              mt: 1,
              boxShadow: 3,
            },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant='h6' component='div'>
            Notificações
          </Typography>
          {!isConnected && <Chip label='Desconectado' color='error' size='small' sx={{ mt: 1 }} />}
        </Box>

        {recentNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsNoneIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
            <Typography variant='body1' color='text.secondary' gutterBottom>
              Nenhuma notificação
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Suas notificações aparecerão aqui
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
            {recentNotifications.map((notification, index) => (
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
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    <ListItemAvatar>
                      {notification.iconUrl ? (
                        <Avatar
                          src={notification.iconUrl}
                          sx={{ width: 40, height: 40 }}
                          alt='Notification icon'
                        />
                      ) : (
                        <Avatar
                          sx={{
                            bgcolor: getSenderColor(notification.senderType),
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getSenderIcon(notification.senderType)}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant='subtitle2'
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
                          <CircleIcon sx={{ fontSize: 8, color: 'primary.main', mt: 0.5 }} />
                        )}
                      </Box>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        component='div'
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1,
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='caption' color='text.secondary' component='span'>
                          {formatTime(notification.createdAt)}
                        </Typography>
                        {notification.senderType && (
                          <Chip
                            label={notification.senderType}
                            size='small'
                            variant='outlined'
                            sx={{
                              height: 20,
                              fontSize: '0.6875rem',
                              '& .MuiChip-label': { px: 1 },
                            }}
                          />
                        )}
                      </Box>
                      {notification.actionUrl && (
                        <Link
                          component='button'
                          variant='caption'
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(notification.actionUrl, '_blank');
                          }}
                          sx={{
                            mt: 0.5,
                            display: 'block',
                            textAlign: 'left',
                          }}
                        >
                          Ver detalhes →
                        </Link>
                      )}
                    </Box>
                  </Box>
                </ListItem>
                {index < recentNotifications.length - 1 && (
                  <Divider variant='inset' component='li' />
                )}
              </React.Fragment>
            ))}
          </List>
        )}

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant='text'
                onClick={handleSeeAll}
                sx={{ textTransform: 'none' }}
              >
                Ver todas as notificações ({notifications.length})
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

export default NotificationsSignalR;
