// Example usage in any component
// components/ExampleUsage.js
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNotificationSender } from './hooks/useNotificationSender';

const ExampleUsage = () => {
  const { sendMessage, sendSuccess, sendReminder, isEnabled } = useNotificationSender();

  const handleFormSubmit = () => {
    // Simulate form submission
    setTimeout(() => {
      sendSuccess('Form Submitted', 'Your form has been successfully submitted!');
    }, 1000);
  };

  const handleNewMessage = () => {
    sendMessage('Alice', 'The meeting has been moved to 3 PM', {
      onClick: () => console.log('Navigate to messages'),
    });
  };

  const handleScheduleReminder = () => {
    sendReminder('Lunch Break', 'Time for your lunch break!', {
      onClick: () => console.log('Navigate to calendar'),
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h6' gutterBottom>
        Use Notifications Anywhere in Your App
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant='contained' onClick={handleFormSubmit} disabled={!isEnabled}>
          Submit Form (Success Notification)
        </Button>

        <Button variant='outlined' onClick={handleNewMessage} disabled={!isEnabled}>
          Simulate New Message
        </Button>

        <Button variant='outlined' onClick={handleScheduleReminder} disabled={!isEnabled}>
          Set Reminder
        </Button>
      </Box>

      {!isEnabled && (
        <Typography variant='body2' color='error' sx={{ mt: 2 }}>
          Please enable notifications to use these features
        </Typography>
      )}
    </Box>
  );
};

export default ExampleUsage;
