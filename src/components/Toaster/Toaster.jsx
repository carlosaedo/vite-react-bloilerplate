import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Toaster = ({ toasts, onRemove }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 100,
        right: 16,
        zIndex: 9999, // Higher z-index to appear above everything
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pointerEvents: 'none', // Allows clicks to pass through empty space
      }}
    >
      {toasts.map((toast) => (
        <Slide key={toast.id} direction='left' in={true} timeout={300}>
          <Paper
            elevation={6}
            sx={{
              backgroundColor: 'white',
              color: '#16a34a', // green-600
              padding: '12px 16px',
              borderRadius: 2,
              border: '1px solid #e5e7eb', // gray-200
              maxWidth: '384px', // max-w-sm
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'auto', // Re-enable pointer events for the toast itself
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: 500,
                flex: 1,
                marginRight: 1,
              }}
            >
              {toast.message}
            </Typography>
            <IconButton
              size='small'
              onClick={() => onRemove(toast.id)}
              sx={{
                color: '#9ca3af', // gray-400
                '&:hover': {
                  color: '#4b5563', // gray-600
                },
                padding: '4px',
              }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </Paper>
        </Slide>
      ))}
    </Box>
  );
};

// Custom hook for managing toasts
const useToaster = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (text, duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message: text, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

export { Toaster, useToaster };
