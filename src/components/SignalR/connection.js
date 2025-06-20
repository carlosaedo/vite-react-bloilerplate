// src/signalr.js
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('http://172.20.1.74:6767/hub/notifications', {
    accessTokenFactory: () => localStorage.getItem('token'),
  })
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryContext) => {
      console.log(retryContext);
      // Retry indefinitely every 30 seconds
      console.log('Retrying connection in 30 seconds...');
      return 30000;
    },
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default connection;
