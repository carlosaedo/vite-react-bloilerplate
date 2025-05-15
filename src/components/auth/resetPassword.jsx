import { useState } from 'react';
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

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/auth/request-password-reset', formData);
      console.log(response.data);
      if (response?.data?.message === 'Código de verificação enviado por email.') {
        setMessage('Código de verificação enviado por email.');
        setTimeout(() => {
          navigateTo('/reset-password-next-step');
        }, 1000);
      } else {
        setMessage('Erro a pedir o código de verificação.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage('Este email não está registado');
      } else if (
        error.response?.status === 400 &&
        error.response?.data === 'Limite diário de pedidos de reset atingido.'
      ) {
        setMessage('Limite diário de pedidos de reset atingido.');
      } else {
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
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div
        style={{
          padding: '0px 20px 0 20px',
        }}
      >
        <Typography variant='h5' gutterBottom>
          Request reset password
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {message && (
            <Typography color='error' variant='body2'>
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
      </div>
    </>
  );
};

export default ResetPassword;
