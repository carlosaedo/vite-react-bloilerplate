import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import torrestirApi from '../api/torrestirApi';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Stack, Link as MuiLink } from '@mui/material';

import { useAuth } from '../context/AuthContext';

const Login2FA = () => {
  const navigateTo = useNavigate();
  const { userEmail } = useParams();
  const { login } = useAuth();
  console.log('params: ', userEmail);

  const [formData, setFormData] = useState({
    userEmail: userEmail,
    code: '',
  });
  const [message, setMessage] = useState(null);

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/Auth/verify-2fa', formData);
      console.log(response.data);
      if (response?.data?.token) {
        login(response?.data?.token);
        //setTimeout(() => {
        navigateTo('/');
        //}, 1000);
      } else {
        setMessage('Erro a pedir o código de verificação.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage('Código inválido ou expirado.');
      } else if (error.response?.status === 400) {
        setMessage('Código inválido ou expirado.');
      } else if (
        error.response?.status === 401 &&
        error.response?.data === 'Código inválido ou expirado.'
      ) {
        setMessage('Código inválido ou expirado.');
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
          Login 2FA
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
            label='2FA Code'
            type='text'
            name='code'
            value={formData.code}
            onChange={handleChange}
            required
            fullWidth
            size='small'
          />

          <Button type='submit' variant='contained' color='primary'>
            Validate
          </Button>
        </Box>

        <Stack direction='row' spacing={2} justifyContent='center' mt={2}>
          <MuiLink
            component={Link}
            to={`/login-2fa-request-new-code/${userEmail}`}
            underline='hover'
            variant='body2'
            color='primary'
          >
            Request new 2FA code
          </MuiLink>
          <MuiLink component={Link} to='/login' underline='hover' variant='body2' color='primary'>
            Back to login
          </MuiLink>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login2FA;
