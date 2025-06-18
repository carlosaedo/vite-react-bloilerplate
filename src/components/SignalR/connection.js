// src/signalr.js
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://your-backend/hub', {
    accessTokenFactory: () => localStorage.getItem('token'),
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default connection;
