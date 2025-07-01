// components/NotificationFloatingButton.js
import React, { useState } from 'react';
import { Fab, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Snackbar } from '@mui/material';
import { Send, Message, Schedule, CheckCircle, Warning, Error, Info } from '@mui/icons-material';
import { useNotificationSender } from '../hooks/useNotificationSender';

export const NotificationFloatingButton = ({ position = { bottom: 16, right: 16 } }) => {
  const { sendMessage, sendReminder, sendSuccess, sendWarning, sendError, sendInfo, isEnabled } =
    useNotificationSender();

  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleClick = (event) => {
    if (!isEnabled) {
      setSnackbar({ open: true, message: 'Please enable notifications first' });
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendDemo = (type) => {
    const demos = {
      message: () => sendMessage('John Doe', 'Hey! How are you doing today?'),
      reminder: () => sendReminder('Meeting Reminder', 'Team standup starts in 10 minutes'),
      success: () => sendSuccess('Task Completed', 'Your report has been successfully submitted'),
      warning: () => sendWarning('Session Warning', 'Your session will expire in 5 minutes'),
      error: () => sendError('Upload Failed', 'There was an error uploading your file'),
      info: () => sendInfo('System Update', 'A new version is available for download'),
    };

    demos[type]();
    handleClose();
    setSnackbar({ open: true, message: `${type} notification sent!` });
  };

  return (
    <>
      <Fab
        color='primary'
        onClick={handleClick}
        sx={{ position: 'fixed', ...position }}
        disabled={!isEnabled}
      >
        <Send />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        <MenuItem onClick={() => sendDemo('message')}>
          <ListItemIcon>
            <Message fontSize='small' />
          </ListItemIcon>
          <ListItemText>Message</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => sendDemo('reminder')}>
          <ListItemIcon>
            <Schedule fontSize='small' />
          </ListItemIcon>
          <ListItemText>Reminder</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => sendDemo('success')}>
          <ListItemIcon>
            <CheckCircle fontSize='small' />
          </ListItemIcon>
          <ListItemText>Success</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => sendDemo('info')}>
          <ListItemIcon>
            <Info fontSize='small' />
          </ListItemIcon>
          <ListItemText>Info</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => sendDemo('warning')}>
          <ListItemIcon>
            <Warning fontSize='small' />
          </ListItemIcon>
          <ListItemText>Warning</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => sendDemo('error')}>
          <ListItemIcon>
            <Error fontSize='small' />
          </ListItemIcon>
          <ListItemText>Error</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};
