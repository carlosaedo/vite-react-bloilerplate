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
    MuiIconButton: {
      styleOverrides: {
        root: {
          // default state
          color: '#003d2c',

          // hover state
          '&:hover': {
            backgroundColor: '#ffc928',
          },
        },
      },
    },
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
      defaultProps: {
        notched: true,
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
      defaultProps: {
        shrink: true, // Always float the label
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            transform: 'scale(1.01)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
