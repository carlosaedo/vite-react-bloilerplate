import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import torrestirApi from '../api/torrestirApi';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Login2FARequestNewCode = () => {
  const navigateTo = useNavigate();
  const { userEmail } = useParams();
  const [formData, setFormData] = useState({
    userEmail: userEmail,
  });
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/Auth/request-2fa', formData);
      console.log(response.data);
      if (response?.status === 200 && response?.data === 'Código enviado.') {
        setMessage('Código enviado.');
        setTimeout(() => {
          navigateTo(`/login-2fa/${userEmail}`);
        }, 1000);
      } else {
        setErrorMessage('Erro a pedir o código de verificação.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('Este email não está registado');
      } else if (
        error.response?.status === 401 &&
        error.response?.data === 'Utilizador inválido.'
      ) {
        setErrorMessage('Utilizador inválido.');
      } else {
        console.error(error);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleRequestResetPassword();
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
          Request new 2FA code
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {errorMessage && (
            <Typography color='error' variant='body2'>
              {errorMessage}
            </Typography>
          )}

          {message && <Typography variant='body2'>{message}</Typography>}

          <Button type='submit' variant='contained' color='primary'>
            Request new code
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

export default Login2FARequestNewCode;
