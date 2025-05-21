import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import torrestirApi from '../api/torrestirApi';
import './login.css';
import {
  Stack,
  Box,
  Link as MuiLink,
  TextField,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import Flork from '../../assets/flork.png';
import FlorkHide from '../../assets/flork-114-png.png';
import FlorkYay from '../../assets/yay-flork.png';
import CryingFlork from '../../assets/crying_flork.png';

import { useAuth } from '../context/AuthContext';

import Logout from '../auth/logout';

const Login = () => {
  const token = localStorage.getItem('token');
  const isTokenPresent = !!localStorage.getItem('token'); // convert to boolean

  const { login } = useAuth();
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showFlork, setShowFlork] = useState(false);
  const [showCryingFlork, setShowCryingFlork] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [userInfo] = useState(() => {
    let userInfo;

    if (token) {
      userInfo = jwtDecode(token);
    } else {
      userInfo = {};
    }

    return userInfo;
  });

  console.log(userInfo);

  const toggleShowFlork = () => {
    setShowFlork(!showFlork);
  };

  const toggleShowCryingFlork = () => {
    setShowCryingFlork(!showCryingFlork);
  };

  async function handleLogin() {
    try {
      const response = await torrestirApi.post('/Auth/login', formData, {});
      console.log('response: ', response.data);
      const { token, requires2FA } = response.data;
      if (token === '' && requires2FA) {
        navigateTo(`/login-2fa/${formData?.email?.trim()}`);
        localStorage.setItem('userEmail', formData?.email?.trim());
      } else if (token && !requires2FA) {
        login(token);
        localStorage.setItem('userEmail', formData?.email?.trim());
        navigateTo('/');
      } else {
        setError('Não tens acesso a isto!');
        toggleShowFlork();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Login inválido');
        if (!showFlork) toggleShowFlork();
      } else if (error.response?.status === 500) {
        setError('Erro no servidor: ' + error.message);
        if (!showCryingFlork) toggleShowCryingFlork();
      } else {
        setError('Erro no servidor: ' + error.message);
        if (!showCryingFlork) toggleShowCryingFlork();
        console.error(error);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin();
  };

  const handleChange = (event) => {
    setError(null);
    setShowFlork(false);
    setShowCryingFlork(false);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      {isTokenPresent ? (
        <div>
          <Logout userInfoData={userInfo} />
        </div>
      ) : (
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
            <Typography variant='h4' gutterBottom>
              Login
            </Typography>

            {showFlork && <img className='flork' src={Flork} alt='Flork' />}
            {showCryingFlork && (
              <img className='crying-flork' src={CryingFlork} alt='Crying Flork' />
            )}

            <form onSubmit={handleSubmit}>
              {error && (
                <Typography variant='body2' color='error' sx={{ marginBottom: 2 }}>
                  {error}
                </Typography>
              )}

              <TextField
                label='Email'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin='normal'
                variant='outlined'
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

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Login
              </Button>
            </form>

            <Stack direction='row' spacing={2} justifyContent='center' mt={2}>
              <MuiLink
                component={Link}
                to='/create-account'
                underline='hover'
                variant='body2'
                color='primary'
              >
                Create an account
              </MuiLink>
              <MuiLink
                component={Link}
                to='/resetpassword'
                underline='hover'
                variant='body2'
                color='primary'
              >
                Reset Password
              </MuiLink>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Login;
