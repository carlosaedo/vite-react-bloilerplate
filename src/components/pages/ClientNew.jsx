import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import torrestirApi from '../api/torrestirApi';

const ClientNew = () => {
  const navigateTo = useNavigate();
  const { checkLoginStatusAuth, loadingAuth } = useAuth();

  const [client, setClient] = useState(null);

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', vat: '', country: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Run on mount: check login and set startup date
    async function checkLoginStatus() {
      try {
        const loginStatus = await checkLoginStatusAuth();

        if (!loginStatus) {
          navigateTo('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigateTo('/login');
      }
    }
    checkLoginStatus();
  }, [navigateTo]); // Only on initial mount

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateNew = async () => {
    try {
      await torrestirApi.post(`/api/clients/new`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClient((prev) => ({ ...prev, ...formData }));
    } catch (error) {
      setError('Failed to create client');
    }
  };

  if (error) return <Alert severity='error'>{error}</Alert>;

  if (loadingAuth) return <CircularProgress sx={{ marginTop: 4 }} />;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        padding: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant='h5' gutterBottom>
          Create new client
        </Typography>

        <Box display='flex' flexDirection='column' gap={2} maxWidth={400}>
          <TextField label='Name' name='name' value={formData.name} onChange={handleChange} />
          <TextField label='VAT' name='vat' value={formData.vat} onChange={handleChange} />
          <TextField
            label='Country'
            name='country'
            value={formData.country}
            onChange={handleChange}
          />
        </Box>

        <Stack direction='row' spacing={2} mt={3}>
          <Button variant='contained' onClick={handleCreateNew} color='primary'>
            Save
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              navigateTo('/client-details');
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ClientNew;
