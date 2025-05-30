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
        marginBottom: isMobile ? '160px' : '120px',
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
          <React.Fragment>
            Torrestir Shipping Portal v{appVersion} <br />
            build {appBuildVersion}
          </React.Fragment>
        ) : (
          <React.Fragment>
            Torrestir Shipping Portal v{appVersion} build {appBuildVersion}
          </React.Fragment>
        )}
      </Typography>
    </Box>
  );
};

export default Footer;
