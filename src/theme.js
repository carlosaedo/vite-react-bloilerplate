// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#003e2d', // your green
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
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
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
