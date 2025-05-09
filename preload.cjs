// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Add any IPC methods you need
  // Example:
  // send: (channel, data) => ipcRenderer.send(channel, data),
  // receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

  // You can add system info or other safe methods here
  platform: process.platform,
});
