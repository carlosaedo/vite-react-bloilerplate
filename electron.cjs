// electron.cjs
require('dotenv').config();
// electron.cjs with enhanced CSP handling
const { app, BrowserWindow, protocol, session } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
  // Set up CSP handler before creating the window
  setupCSP();

  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Determine how to load the app
  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Running in production mode');

    // Load the index.html from the dist folder
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    console.log('Loading from:', indexPath);

    // Create a URL using the file protocol
    const startUrl = url.format({
      pathname: indexPath,
      protocol: 'file:',
      slashes: true,
    });

    mainWindow.loadURL(startUrl);

    // Handle failed loads by redirecting to index.html (for SPA routing)
    mainWindow.webContents.on('did-fail-load', () => {
      console.log('Failed to load, retrying with index.html');
      mainWindow.loadURL(startUrl);
    });

    // Optional: Log file existence for debugging
    if (fs.existsSync(indexPath)) {
      console.log('Index file exists at:', indexPath);
    } else {
      console.log('Index file NOT found at:', indexPath);
    }
  }
}

// Set up appropriate CSP based on environment
function setupCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    let csp;

    if (process.env.NODE_ENV === 'development') {
      // More permissive CSP for development
      csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self' ws://localhost:5173", // Allow WebSocket for HMR
      ].join('; ');
    } else {
      // Stricter CSP for production
      csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "img-src 'self' data:",
      ].join('; ');
    }

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
      },
    });
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Register file protocol handler for serving local files correctly
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback({ path: pathname });
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
