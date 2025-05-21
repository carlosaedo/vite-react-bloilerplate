// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    // Optionally set other defaults
    fontSize: 14, // base font size
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#003D2C', // your green
    },
    secondary: {
      main: '#ffc928', // your yellow
    },
    background: {
      default: '#f9f9f9', // soft light background
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#4f4f4f',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Don't force uppercase
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
