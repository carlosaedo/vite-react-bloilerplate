import { useState } from 'react';
import { Link } from 'react-router-dom';
import torrestirApi from '../api/torrestirApi';
import './login.css';
import Flork from '../../assets/flork.png';

import FlorkHide from '../../assets/flork-114-png.png';
import FlorkYay from '../../assets/yay-flork.png';

import CryingFlork from '../../assets/crying_flork.png';

const Login = () => {
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
      /*const token = 'mocktoken';
      const returnUserGroup = 'userMock';*/
      if (token) {
        localStorage.setItem('token', token);
        window.location.href = '/';
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
      <h2>Login</h2>
      {showFlork && <img className='flork' src={Flork} />}
      {showCryingFlork && <img className='crying-flork' src={CryingFlork} />}
      <form className='login-form' onSubmit={handleSubmit}>
        {error && <div className='error'>{error}</div>}
        <div>
          <label>Email:</label>
          <input type='email' name='email' value={formData.email} onChange={handleChange} />
        </div>
        <label>Password:</label>
        <div className='input-form-password'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
          <span onClick={handleTogglePasswordVisibility}>
            <img className='flork-pass-login' src={showPassword ? FlorkYay : FlorkHide} />
          </span>
        </div>

        <button type='submit'>Login</button>
      </form>
      <p>
        <Link className='custom-link' to='/resetpassword'>
          Repor palavra chave
        </Link>
      </p>
    </>
  );
};

export default Login;
