import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
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

const ClientDetails = () => {
  const navigateTo = useNavigate();

  const { checkLoginStatusAuth, loadingAuth, getToken } = useAuth();

  const { clientId: paramClientId } = useParams();
  const clientIdFromStorage = JSON.parse(localStorage.getItem('selectedClient'));

  const [clientId, setClientId] = useState(paramClientId ?? clientIdFromStorage?.clientId);

  console.log(clientId);

  // Sync with URL when it changes
  useEffect(() => {
    if (paramClientId !== undefined && paramClientId !== clientId) {
      setClientId(paramClientId);
    }
  }, [paramClientId]);

  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', vat: '', country: '' });

  const token = getToken();

  useEffect(() => {
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
  }, [navigateTo]);

  useEffect(() => {
    // If no clientId, set loading false and show error, then exit early
    if (!clientId) {
      setLoading(false);
      setErrorMessage('No client selected. Cannot show client details.');
      setClient(null);
      setFormData(null);
      return;
    }

    // Reset states for new fetch
    setLoading(true);
    setErrorMessage(null);

    const fetchClient = async () => {
      try {
        const response = await torrestirApi.get(`/api/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClient(response.data);
        setFormData({
          name: response.data.name,
          vat: response.data.vat,
          country: response.data.country,
          isActive: response.data.isActive,
          isDeleted: response.data.isDeleted,
        });
      } catch (error) {
        setErrorMessage('Failed to fetch client data.');
        setClient(null);
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, token]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await torrestirApi.put(`/api/clients/${clientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClient((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (error) {
      setErrorMessage('Failed to update client');
    }
  };

  const handleDelete = async () => {
    try {
      const updatedData = { ...formData, isDeleted: true };

      await torrestirApi.delete(`/api/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClient((prev) => ({ ...prev, isDeleted: true }));
      setFormData(updatedData);
      setEditMode(false);
    } catch (error) {
      setErrorMessage('Failed to delete client');
    }
  };

  const handleCreateNew = () => {
    navigate('/client-new');
  };

  const handleRestore = async () => {
    try {
      const updatedData = { ...formData, isDeleted: false };

      await torrestirApi.put(`/api/clients/${clientId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClient((prev) => ({ ...prev, isDeleted: false }));
      setFormData(updatedData);
      setEditMode(false);
    } catch (error) {
      setErrorMessage('Failed to restore client');
    }
  };

  const handleDisable = async () => {
    try {
      const updatedData = { ...formData, isActive: false };

      await torrestirApi.put(`/api/clients/${clientId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClient((prev) => ({ ...prev, isActive: false }));
      setFormData(updatedData);
      setEditMode(false);
    } catch (error) {
      setErrorMessage('Failed to restore client');
    }
  };

  const handleEnable = async () => {
    try {
      const updatedData = { ...formData, isActive: true };

      await torrestirApi.put(`/api/clients/${clientId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClient((prev) => ({ ...prev, isActive: true }));
      setFormData(updatedData);
      setEditMode(false);
    } catch (error) {
      setErrorMessage('Failed to restore client');
    }
  };
  if (loading || loadingAuth) return <CircularProgress sx={{ marginTop: 4 }} />;
  if (errorMessage) return <Alert severity='error'>{errorMessage}</Alert>;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Box sx={{ width: '600px', margin: '0 auto' }}>
        <Typography variant='h5' gutterBottom>
          Client Details
        </Typography>

        {client && (
          <Stack direction='row' spacing={1} mb={2}>
            <Chip
              label={client.isDeleted ? 'Deleted' : 'Not Deleted'}
              color={client.isDeleted ? 'error' : 'default'}
            />
            <Chip
              label={client.isActive ? 'Active' : 'Inactive'}
              color={client.isActive ? 'success' : 'default'}
            />
          </Stack>
        )}

        <Box display='flex' flexDirection='column' gap={2} width={'100%'}>
          <TextField
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            disabled={!editMode}
          />
          <TextField
            label='VAT'
            name='vat'
            value={formData.vat}
            onChange={handleChange}
            disabled={!editMode}
          />
          <TextField
            label='Country'
            name='country'
            value={formData.country}
            onChange={handleChange}
            disabled={!editMode}
          />
        </Box>

        <Stack direction='row' spacing={2} mt={3}>
          {editMode ? (
            <React.Fragment>
              <Button variant='outlined' color='primary' onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button
                variant='outlined'
                color='error'
                onClick={client.isDeleted ? handleRestore : handleDelete}
              >
                {client.isDeleted ? 'Restore' : 'Delete'}
              </Button>

              <Button
                variant='outlined'
                color='primary'
                onClick={client.isActive ? handleDisable : handleEnable}
              >
                {client.isActive ? 'Disable' : 'Enable'}
              </Button>
              <Button variant='contained' onClick={handleUpdate} color='primary'>
                Save
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button variant='contained' onClick={() => setEditMode(true)}>
                Edit
              </Button>
              <Button variant='contained' color='secondary' onClick={handleCreateNew}>
                Create New
              </Button>
            </React.Fragment>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ClientDetails;
