import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n.js'; // Import the i18n configuration
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { appBuildVersion } from './appVersion.js';
import { AuthProvider } from './components/context/AuthContext';
import { ClientProvider } from './components/context/ClientContext';
import { ConfirmationProvider } from './components/context/ConfirmationModalContext';
import cleanLocalStorage from './utils/cleanLocalStorage.js';
import theme from './theme'; // import the theme file
import App from './App.jsx';
import './index.css';
import './Robot.css';

// Check app version before rendering
const APP_BUILD_VERSION = appBuildVersion;
const storedVersion = localStorage.getItem('appBuildVersion');

if (storedVersion && storedVersion !== APP_BUILD_VERSION) {
  console.warn('App version changed. Clearing localStorage...');
  cleanLocalStorage();
}

if (!storedVersion) {
  console.warn('App version not found. Clearing localStorage...');
  cleanLocalStorage();
}

localStorage.setItem('appBuildVersion', APP_BUILD_VERSION);

window.addEventListener('storage', (event) => {
  if (event.key === 'appBuildVersion') {
    if (event.newValue !== appBuildVersion) {
      localStorage.clear();
      localStorage.setItem('appBuildVersion', appBuildVersion);
      window.location.reload();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename='/shipping-portal/'>
          <ClientProvider>
            <ConfirmationProvider>
              <App />
            </ConfirmationProvider>
          </ClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
