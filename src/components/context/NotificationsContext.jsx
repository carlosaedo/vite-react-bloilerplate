import React, { createContext, useContext, useEffect, useState } from 'react';
import torrestirApi from '../api/torrestirApi';
import connection from '../SignalR/connection';
import { useAuth } from './AuthContext';
import { useToaster, Toaster } from '../Toaster/Toaster';

import { useNotificationSender } from '../hooks/useNotificationSender';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const { sendMessage, sendReminder, sendSuccess, sendWarning, sendError, sendInfo, isEnabled } =
    useNotificationSender();
  const [lastNotification, setLastNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toasts, removeToast, showToast } = useToaster();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await torrestirApi.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data || [];
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

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
            startConnection(); // Retry
          }, 10000);
        }
      }
    };

    startConnection();

    connection.on('ReceiveNotification', async (notification) => {
      console.log('Received notification:', notification);
      setLastNotification(notification);
      showToast(notification?.title);

      if (isEnabled) {
        sendMessage(notification?.title, notification?.message);
      }

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
  }, [token, isEnabled]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await torrestirApi.patch(`/api/notifications/${notificationId}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(`Failed to mark ${notificationId} as read:`, err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    const results = await Promise.allSettled(
      unreadNotifications.map((notification) =>
        torrestirApi.patch(`/api/notifications/${notification.notificationId}/read`, null, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    );

    // Log any errors
    for (const [index, result] of results.entries()) {
      if (result.status === 'rejected') {
        console.error(
          `Failed to mark notification ${unreadNotifications[index].notificationId}:`,
          result.reason,
        );
      }
    }

    // Optimistically mark all as read
    setNotifications((prev) => prev.map((n) => (n.isRead ? n : { ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markNotificationAsRead,
        markAllAsRead,
        notificationsLoading: loading,
        notificationsError: error,
        lastNotification,
      }}
    >
      {children}
      <Toaster toasts={toasts} onRemove={removeToast} />
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
