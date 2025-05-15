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

import { useContextApi } from '../context/ApiContext';

import Logout from '../auth/logout';

const Login = () => {
  const navigateTo = useNavigate();
  const { contextApiData, setContextApiData } = useContextApi();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginStatus, setLoginStatus] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
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

  useEffect(() => {
    async function checkLoginStatus() {
      const loginStatus = await authCheckLoginStatus();
      setLoginStatus(loginStatus);
      setContextApiData({
        ...contextApiData,
        login: loginStatus,
      });
      setLoading(false); // Set loading to false once login status is checked
    }
    checkLoginStatus();
  }, []);

  async function handleLogin() {
    try {
      const response = await torrestirApi.post('/auth/login', formData, {});
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setContextApiData({
          ...contextApiData,
          login: true,
        });
        navigateTo(0);
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

  if (loading) {
    return <div>Loading...</div>; // Show loading message while checking login status
  }

  return (
    <>
      {loginStatus ? (
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
