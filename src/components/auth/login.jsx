import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import torrestirApi from '../api/torrestirApi';
import './login.css';
import {
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
import authCheckLoginStatus from '../../utils/authCheckLoginStatus';

import { useAuth } from '../context/AuthContext';

import Logout from '../auth/logout';

const Login = () => {
  const { isLoggedIn, logout, login } = useAuth();
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showFlork, setShowFlork] = useState(false);
  const [showCryingFlork, setShowCryingFlork] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowFlork = () => {
    setShowFlork(!showFlork);
  };

  const toggleShowCryingFlork = () => {
    setShowCryingFlork(!showCryingFlork);
  };

  async function handleLogin() {
    try {
      const response = await torrestirApi.post('/auth/login', formData, {});
      const { token } = response.data;
      if (token) {
        login(token);
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
      {isLoggedIn ? (
        <div>
          <Logout />
        </div>
      ) : (
        <div
          style={{
            padding: '0px 20px 0 20px',
          }}
        >
          <Typography variant='h4' gutterBottom>
            Login
          </Typography>

          {showFlork && <img className='flork' src={Flork} alt='Flork' />}
          {showCryingFlork && <img className='crying-flork' src={CryingFlork} alt='Crying Flork' />}

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

          <p>
            <Link className='custom-link' to='/resetpassword'>
              Reset Password
            </Link>
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
