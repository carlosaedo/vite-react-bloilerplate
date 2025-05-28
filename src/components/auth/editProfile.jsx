import { useState } from 'react';
import torrestirApi from '../api/torrestirApi';
import { Link } from 'react-router-dom';
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

const EditProfile = () => {
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
  });
  const [message, setMessage] = useState(null);

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
          Edit Profile
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

          <Button type='submit' variant='contained' color='primary'>
            Save changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
