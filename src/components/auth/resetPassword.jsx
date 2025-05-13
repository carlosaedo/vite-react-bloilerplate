import { useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import './login.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [message, setMessage] = useState(null);

  async function handleRequestResetPassword() {
    try {
      const response = await api.post(
        `/auth/request-reset-password?email=${formData.email}`,
        formData,
      );
      console.log(response);
      setMessage('Pedido de reset concluido. Verifique a sua caixa de email.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('Este email não está registado');
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

  return (
    <>
      <h2>Login</h2>
      <form className='login-form' onSubmit={handleSubmit}>
        {message && <div className='error'>{message}</div>}
        <div>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type='submit'>Reset</button>
      </form>
      <p>
        <Link className='custom-link' to='/login'>
          Voltar ao login
        </Link>
      </p>
    </>
  );
};

export default ResetPassword;
