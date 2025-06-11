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

const ResetPasswordNextStep = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  async function handleRequestResetPassword() {
    try {
      const response = await torrestirApi.post('/auth/confirm-password-reset', formData);
      console.log(response);
      if (
        response?.status === 200 &&
        response?.data?.message === 'Password atualizada com sucesso.'
      ) {
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

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  const handleToggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prevShowConfirmNewPassword) => !prevShowConfirmNewPassword);
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
          Reset password
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

          <TextField
            label='Code'
            type='text'
            name='code'
            value={formData.code}
            onChange={handleChange}
            required
            fullWidth
            size='small'
          />

          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showNewPassword ? 'text' : 'password'}
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleToggleNewPasswordVisibility}>
                    <img
                      className='flork-pass-login'
                      src={showNewPassword ? FlorkYay : FlorkHide}
                      alt='Toggle Password Visibility'
                    />
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
            />
          </FormControl>

          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showConfirmNewPassword ? 'text' : 'password'}
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleToggleConfirmNewPasswordVisibility}>
                    <img
                      className='flork-pass-login'
                      src={showConfirmNewPassword ? FlorkYay : FlorkHide}
                      alt='Toggle Password Visibility'
                    />
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
            />
          </FormControl>

          <Button type='submit' variant='contained' color='primary'>
            Reset password
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

export default ResetPasswordNextStep;
