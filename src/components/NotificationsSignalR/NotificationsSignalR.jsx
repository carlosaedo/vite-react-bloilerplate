import React, { useEffect, useState } from 'react';
import connection from '../SignalR/connection';

function NotificationsSignalR() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR connected');
        setIsConnected(true);
      } catch (err) {
        console.error('SignalR connection failed:', err);
        setIsConnected(false);
      }
    };

    startConnection();

    // Listen for messages
    connection.on('ReceiveMessage', (user, message) => {
      setMessages((prev) => [...prev, { user, message }]);
    });

    connection.on('ReceiveNotification', (notification) => {
      console.log('Received notification:', notification);
    });

    return () => {
      connection.off('ReceiveMessage');
      connection.off('ReceiveNotification');
      connection.stop();
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
      <h3>Chat</h3>
      {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
      {messages.map((m, idx) => (
        <div key={idx}>
          <b>{m.user}:</b> {m.message}
        </div>
      ))}
      <button onClick={sendMessage}>Send Test Message</button>
    </div>
  );
}

export default NotificationsSignalR;
