import { useState } from 'react';
import torrestirApi from '../api/torrestirApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const ChangePassword = () => {
  const navigateTo = useNavigate();

  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  async function handleRequestResetPassword() {
    try {
      const token = getToken();

      const response = await torrestirApi.post('/Account/change-password', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        setMessage('Algo correu mal.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('Este email não está registado');
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error === 'Código inválido ou expirado.'
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

  const handleToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prevShowCurrentPassword) => !prevShowCurrentPassword);
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
          Change Password
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

          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel>Current Password</InputLabel>
            <OutlinedInput
              type={showCurrentPassword ? 'text' : 'password'}
              name='currentPassword'
              value={formData.currentPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleToggleCurrentPasswordVisibility}>
                    <img
                      className='flork-pass-login'
                      src={showCurrentPassword ? FlorkYay : FlorkHide}
                      alt='Toggle Password Visibility'
                    />
                  </IconButton>
                </InputAdornment>
              }
              label='Current Password'
            />
          </FormControl>

          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel>New Password</InputLabel>
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
              label='New Password'
            />
          </FormControl>

          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel>Confirm New Password</InputLabel>
            <OutlinedInput
              type={showConfirmNewPassword ? 'text' : 'password'}
              name='confirmNewPassword'
              value={formData.confirmNewPassword}
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
              label='Confirm New Password'
            />
          </FormControl>

          <Button type='submit' variant='contained' color='primary'>
            Change password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangePassword;
