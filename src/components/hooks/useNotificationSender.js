// hooks/useNotificationSender.js
import { useNotifications } from '../context/NotificationContext';

export const useNotificationSender = () => {
  const { sendNotification, permission } = useNotifications();

  const sendMessage = (from, message, options = {}) => {
    return sendNotification(`💬 New message from ${from}`, {
      body: message,
      icon: 'https://via.placeholder.com/64/2196f3/ffffff?text=💬',
      tag: `message-${from}`,
      ...options,
    });
  };

  const sendReminder = (title, message, options = {}) => {
    return sendNotification(`⏰ ${title}`, {
      body: message,
      icon: 'https://via.placeholder.com/64/ff9800/ffffff?text=⏰',
      tag: 'reminder',
      requireInteraction: true,
      ...options,
    });
  };

  const sendSuccess = (title, message = 'Operation completed successfully', options = {}) => {
    return sendNotification(`✅ ${title}`, {
      body: message,
      icon: 'https://via.placeholder.com/64/4caf50/ffffff?text=✅',
      tag: 'success',
      ...options,
    });
  };

  const sendError = (title, message, options = {}) => {
    return sendNotification(`❌ ${title}`, {
      body: message,
      icon: 'https://via.placeholder.com/64/f44336/ffffff?text=❌',
      tag: 'error',
      requireInteraction: true,
      ...options,
    });
  };

  const sendWarning = (title, message, options = {}) => {
    return sendNotification(`⚠️ ${title}`, {
      body: message,
      icon: 'https://via.placeholder.com/64/ff5722/ffffff?text=⚠️',
      tag: 'warning',
      requireInteraction: true,
      ...options,
    });
  };

  const sendInfo = (title, message, options = {}) => {
    return sendNotification(`ℹ️ ${title}`, {
      body: message,
      icon: 'https://via.placeholder.com/64/2196f3/ffffff?text=ℹ️',
      tag: 'info',
      ...options,
    });
  };

  return {
    sendNotification,
    sendMessage,
    sendReminder,
    sendSuccess,
    sendError,
    sendWarning,
    sendInfo,
    permission,
    isEnabled: permission === 'granted',
  };
};
