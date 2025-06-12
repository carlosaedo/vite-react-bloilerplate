import React from 'react';
import { Typography } from '@mui/material';

const ErrorMessage = ({ errorMessage }) => {
  return (
    <React.Fragment>
      {errorMessage && (
        <Typography
          color='error'
          variant='body2'
          sx={{
            backgroundColor: '#ffebee',
            padding: 1,
            borderRadius: 1,
            border: '1px solid #ffcdd2',
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </React.Fragment>
  );
};

export default ErrorMessage;
