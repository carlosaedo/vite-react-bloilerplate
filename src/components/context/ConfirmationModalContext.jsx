import React, { createContext, useContext, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const ConfirmationContext = createContext();

export function ConfirmationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Confirm');
  const [confirmText, setConfirmText] = useState('Confirm');
  const [cancelText, setCancelText] = useState('Cancel');
  const [severity, setSeverity] = useState('error'); // 'error', 'warning', 'info'
  const resolverRef = useRef(null);

  const confirm = async (options) => {
    // Handle both string and object parameters
    if (typeof options === 'string') {
      options = { message: options };
    }

    const {
      message: msg,
      title: ttl = 'Confirm',
      confirmText: confirmTxt = 'Confirm',
      cancelText: cancelTxt = 'Cancel',
      severity: sev = 'error',
    } = options;

    setMessage(msg);
    setTitle(ttl);
    setConfirmText(confirmTxt);
    setCancelText(cancelTxt);
    setSeverity(sev);
    setOpen(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const handleClose = (result) => {
    setOpen(false);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  const getButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={open} onClose={() => handleClose(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color='inherit'>
            {cancelText}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant='contained'
            color={getButtonColor()}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmationProvider');
  }
  return context.confirm;
}

// Usage examples:
/*
// 1. Wrap your app with the provider
function App() {
  return (
    <ConfirmationProvider>
      <MyComponent />
    </ConfirmationProvider>
  );
}

// 2. Use in any component
function MyComponent() {
  const confirm = useConfirm();

  const handleDelete = async () => {
    // Simple usage
    const confirmed = await confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    // Advanced usage with options
    const confirmed2 = await confirm({
      message: 'Are you sure you want to remove all packages? This action cannot be undone.',
      title: 'Delete All Packages',
      confirmText: 'Delete All',
      cancelText: 'Keep Packages',
      severity: 'error'
    });
    if (!confirmed2) return;

    console.log('Deleting...');
  };

  const handleWarning = async () => {
    const confirmed = await confirm({
      message: 'This will overwrite existing data. Continue?',
      title: 'Overwrite Data',
      confirmText: 'Overwrite',
      severity: 'warning'
    });
    if (confirmed) {
      console.log('Overwriting...');
    }
  };

  return (
    <div>
      <Button onClick={handleDelete}>Delete</Button>
      <Button onClick={handleWarning}>Overwrite</Button>
    </div>
  );
}
*/
