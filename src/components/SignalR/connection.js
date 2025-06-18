// src/signalr.js
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('http://172.20.1.74:6767/hub/notifications', {
    accessTokenFactory: () => localStorage.getItem('token'),
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default connection;
