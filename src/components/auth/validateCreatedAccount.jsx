import React, { useState } from 'react';
import torrestirApi from '../api/torrestirApi';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Link as MuiLink,
} from '@mui/material';

import FlorkHide from '../../assets/flork-114-png.png';
import FlorkYay from '../../assets/yay-flork.png';

const CreateAccount = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    token: '',
  });

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/Account/activate-account', formData);
      console.log(response);
      if (response?.status === 200 && response?.data?.message === 'Conta criada com sucesso.') {
        setMessage('Password atualizada com sucesso.');
        setTimeout(() => {
          navigateTo('/login');
        }, 1000);
      } else {
        setErrorMessage('Algo correu mal.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Este email não está registado');
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error === 'Código inválido ou expirado.'
      ) {
        setErrorMessage('Código inválido ou expirado.');
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
    setErrorMessage(null);
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
          Validate created account
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

          <TextField
            label='Token'
            type='text'
            name='token'
            value={formData.token}
            onChange={handleChange}
            required
            fullWidth
            size='small'
          />

          <Button type='submit' variant='contained' color='primary'>
            Validate account
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

export default CreateAccount;
