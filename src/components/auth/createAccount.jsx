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
    displayName: '',
    realName: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/Account/register', formData);
      console.log(response);
      if (response?.status === 200) {
        setMessage('Conta criada. Verifique o seu email para ativar a conta.');
        setTimeout(() => {
          navigateTo('/validate-created-account');
        }, 1000);
      } else {
        setErrorMessage('Algo correu mal.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Este email não está registado');
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error === 'Esse email já se encontra registado.'
      ) {
        setErrorMessage('Esse email já se encontra registado.');
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
          Create an account
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
            label='Display Name'
            type='text'
            name='displayName'
            value={formData.displayName}
            onChange={handleChange}
            required
            fullWidth
            size='small'
          />

          <TextField
            label='Real Name'
            type='text'
            name='realName'
            value={formData.realName}
            onChange={handleChange}
            required
            fullWidth
            size='small'
          />

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

          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    <img
                      className='flork-pass-login'
                      src={showPassword ? FlorkYay : FlorkHide}
                      alt='Toggle Password Visibility'
                    />
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
            />
          </FormControl>

          <Button type='submit' variant='contained' color='primary'>
            Create account
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
