import React from 'react';
import { Typography } from '@mui/material';

const Message = ({ message }) => {
  return (
    <React.Fragment>
      {message && (
        <Typography
          variant='body2'
          sx={{
            backgroundColor: '#e8f5e8',
            padding: 1,
            borderRadius: 1,
            border: '1px solid #c8e6c9',
            color: '#2e7d32',
          }}
        >
          {message}
        </Typography>
      )}
    </React.Fragment>
  );
};

export default Message;
