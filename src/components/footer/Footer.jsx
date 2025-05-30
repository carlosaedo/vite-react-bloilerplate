import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { appVersion, appBuildVersion } from '../../appVersion';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        marginTop: 2,
        marginBottom: isMobile ? '150px' : '80px',
        textAlign: 'center',
      }}
    >
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{
          fontWeight: 500,
          fontSize: isMobile ? '0.8rem' : '0.9rem',
        }}
      >
        {isMobile ? (
          <>
            Torrestir Shipping Portal v{appVersion} <br />
            build {appBuildVersion}
          </>
        ) : (
          <>
            Torrestir Shipping Portal v{appVersion} build {appBuildVersion}
          </>
        )}
      </Typography>
    </Box>
  );
};

export default Footer;
