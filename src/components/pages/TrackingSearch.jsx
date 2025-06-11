import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const TrackingSearch = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      // Navigate to the tracking page with the tracking number as a parameter
      navigate(`/tracking/${trackingNumber.trim()}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && trackingNumber.trim()) {
      handleSearch();
    }
  };

  return (
    <Container maxWidth='md'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontWeight: 700,
            mb: 6,
            color: '#003D2C',
            letterSpacing: '-0.025em',
            maxWidth: '600px',
          }}
        >
          Search for your tracking information here.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',

            alignItems: 'stretch',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Enter tracking number'
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <Button
            variant='contained'
            onClick={handleSearch}
            disabled={!trackingNumber.trim()}
            startIcon={<SearchIcon />}
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#003D2C',
              },
              '&:disabled': {
                backgroundColor: '#adb8b4',
                color: '#ffffff',
              },
            }}
          >
            Search
          </Button>
        </Box>

        <Typography
          variant='body2'
          sx={{
            mt: 3,
            maxWidth: '400px',
          }}
        >
          Enter your tracking number to get real-time updates on your shipment status and delivery
          information.
        </Typography>
      </Box>
    </Container>
  );
};

export default TrackingSearch;
