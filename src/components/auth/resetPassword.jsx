import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import torrestirApi from '../api/torrestirApi';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Link as MuiLink } from '@mui/material';

const ResetPassword = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
  });
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/Account/request-password-reset', formData);
      console.log(response.data);
      if (
        response?.status === 200 &&
        response?.data === 'Se o email existir, foi enviado um link para repor a password.'
      ) {
        setMessage('Se o email existir, foi enviado um link para repor a password.');
        setTimeout(() => {
          navigateTo('/login');
        }, 1000);
      } else {
        setErrorMessage('Erro a pedir o código de verificação.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('Este email não está registado');
      } else if (
        error.response?.status === 400 &&
        error.response?.data === 'Limite diário de pedidos de reset atingido.'
      ) {
        setErrorMessage('Limite diário de pedidos de reset atingido.');
      } else if (error.response?.status === 500) {
        setErrorMessage('Erro a pedir o reset da password.');
      } else {
        setErrorMessage('Erro a pedir o reset da password.');
        console.error(error);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleRequestResetPassword();
  };

  const handleChange = (event) => {
    setMessage(null);
    setErrorMessage(null);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        padding: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant='h5' gutterBottom>
          Request reset password
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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

          <TextField
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            size='small'
          />

          <Button type='submit' variant='contained' color='primary'>
            Request reset password
          </Button>
        </Box>

        <Typography variant='body2' sx={{ mt: 2 }}>
          <MuiLink component={Link} to='/login' underline='hover'>
            Back to login
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPassword;
