import React, { useState } from 'react';
import api from '../api/api';
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

import Message from '../messages/Message';
import ErrorMessage from '../messages/ErrorMessage';
import TirCaptcha from '../TirCaptcha/TirCaptcha.jsx';

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
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');

  async function handleRequestCreateNewAccount() {
    // First validate captcha before proceeding
    if (!captchaValid) {
      setErrorMessage('Please complete the security verification first.');
      return;
    }

    try {
      // Include captcha validation in the request to your backend
      const requestData = {
        ...formData,
        captchaToken: captchaValue, // Include the validated captcha
      };

      const response = await torrestirApi.post('/Account/register', requestData);
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
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes('captcha')
      ) {
        setErrorMessage('Security verification failed. Please try again.');
        setCaptchaValid(false);
      } else {
        console.error(error);
        setErrorMessage('Algo correu mal.');
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleRequestCreateNewAccount();
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

  const handleCaptchaValidation = (isValid, captchaCode) => {
    setCaptchaValid(isValid);
    setCaptchaValue(isValid ? captchaCode : '');

    if (isValid) {
      setErrorMessage(null); // Clear any previous captcha errors
    }
  };

  const handleCaptchaError = (errorMsg) => {
    setCaptchaValid(false);
    setCaptchaValue('');
    setErrorMessage(errorMsg);
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
          <ErrorMessage errorMessage={errorMessage} />
          <Message message={message} />

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

          <TirCaptcha
            apiInstance={api}
            antiPhishingKey='b647d2331b97509caa701db9ba7568ce7c82f30db8da8d241c486f8dadd002ff'
            onValidation={handleCaptchaValidation}
            onError={handleCaptchaError}
            showInput={true}
            label='Security Verification'
            size='large'
          />

          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={!captchaValid}
            sx={{
              opacity: captchaValid ? 1 : 0.7,
            }}
          >
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
