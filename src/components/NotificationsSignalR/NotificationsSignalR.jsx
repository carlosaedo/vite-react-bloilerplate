import React, { useEffect, useState } from 'react';
import connection from '../SignalR/connection';

function NotificationsSignalR() {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const startConnection = async () => {
      // Simple fix: only start if disconnected
      if (connection.state === 'Disconnected') {
        try {
          await connection.start();
          console.log('SignalR connected');
          setIsConnected(true);
        } catch (err) {
          console.error('SignalR connection failed:', err);
          setIsConnected(false);
        }
      }
    };

    startConnection();

    connection.on('ReceiveNotification', (notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      connection.off('ReceiveNotification');
    };
  }, []);

  const sendMessage = async () => {
    try {
      await connection.invoke('SendMessage', 'ReactUser', 'Hello from React!');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div>
      <h3>Notifications</h3>
      {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
      <button onClick={sendMessage}>Send Test Message</button>
      {notifications.map((notification, index) => (
        <div key={index}>{JSON.stringify(notification)}</div>
      ))}
    </div>
  );
}

export default NotificationsSignalR;
