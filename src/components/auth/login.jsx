import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import './login.css';
import Flork from '../../assets/flork.png';

import FlorkHide from '../../assets/flork-114-png.png';
import FlorkYay from '../../assets/yay-flork.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [showFlork, setShowFlork] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowFlork = () => {
    setShowFlork(!showFlork);
  };

  async function handleLogin() {
    try {
      //const response = await api.post('/auth/login', formData, {});
      //const { token, returnUserGroup } = response.data;
      const token = 'mocktoken';
      const returnUserGroup = 'userMock';
      if (returnUserGroup === 'administrator') {
        localStorage.setItem('token', token);
        localStorage.setItem('userGroup', returnUserGroup);
        window.location.href = '/';
      } else {
        setError('Não tens acesso a isto!');
        toggleShowFlork();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Login inválido');
        if (!showFlork) toggleShowFlork();
      } else {
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
