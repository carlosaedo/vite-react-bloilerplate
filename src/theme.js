// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    fontSize: 14,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#003D2C', // green
    },
    secondary: {
      main: '#ffc928', // yellow
    },
    background: {
      default: '#f9f9f9',
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
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffc928', // yellow focus for input
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#ffc928', // yellow label on focus
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#003D2C', // green dropdown arrow
        },
        outlined: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#003D2C', // green select focus
          },
        },
      },
    },
  },
});

export default theme;
