import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import torrestirApi from '../api/torrestirApi';
import { Box, Typography, Button, Stack, Link as MuiLink, TextField } from '@mui/material';

import { useAuth } from '../context/AuthContext';

import TruckLoader from '../truckLoader/truckLoader';

import Message from '../messages/Message';
import ErrorMessage from '../messages/ErrorMessage';

const Login2FA = () => {
  const navigateTo = useNavigate();
  const { userEmail } = useParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    userEmail: userEmail,
    code: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);

  async function handleRequest(code = null) {
    try {
      const codeToUse = code || formData.code;
      const response = await torrestirApi.post('/Auth/verify-2fa', {
        ...formData,
        code: codeToUse,
      });
      if (response?.data?.token) {
        login(response?.data?.token);
        setMessage('Código 2FA aceite. A redirecionar...');
        setTimeout(() => {
          navigateTo('/');
        }, 1000);
      } else {
        setErrorMessage('Erro a pedir o código de verificação.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('Código inválido ou expirado.');
      } else if (error.response?.status === 400) {
        setErrorMessage('Código inválido ou expirado.');
      } else if (
        error.response?.status === 401 &&
        error.response?.data === 'Código inválido ou expirado.'
      ) {
        setErrorMessage('Código inválido ou expirado.');
      } else {
        console.error(error);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const code = codeDigits.join('');
    console.log('Submitted code:', code);

    setFormData({ ...formData, code });
    await handleRequest(code);
    // Reset animation state after submission
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000); // Adjust timing as needed
  };

  const handleAutoSubmit = async (code) => {
    setIsSubmitting(true);
    await handleRequest(code);
    // Reset animation state after submission
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000); // Adjust timing as needed
  };

  const handleChange = (event) => {
    setMessage(null);
    setErrorMessage(null);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleDigitChange = (index, value) => {
    setMessage(null);
    setErrorMessage(null);
    // Only allow single digits
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Update formData for compatibility with existing logic
    const newCode = newDigits.join('');
    setFormData({ ...formData, code: newCode });

    // Auto-submit if all digits are filled
    if (newDigits.every((d) => d) && index === 5) {
      handleAutoSubmit(newCode);
    }
  };

  const handleKeyDown = (index, e) => {
    setMessage(null);
    setErrorMessage(null);
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newDigits = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCodeDigits(newDigits);
    setFormData({ ...formData, code: pastedData });

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    const nextInput = document.getElementById(`digit-${nextIndex}`);
    if (nextInput) nextInput.focus();

    // Auto-submit if all digits are filled
    if (pastedData.length === 6) {
      handleAutoSubmit(pastedData);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          padding: 4,
          width: '100%',
          maxWidth: 460,
          textAlign: 'center',
        }}
      >
        <Typography
          variant='h6'
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            color: '#003D2C',
            letterSpacing: '-0.025em',
          }}
        >
          Two-Factor Authentication
        </Typography>
        <TruckLoader />

        <Typography
          variant='body1'
          sx={{
            mb: 4,
            lineHeight: 1.5,
          }}
        >
          Enter the 6-digit code
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <ErrorMessage errorMessage={errorMessage} />
          <Message message={message} />

          {/* 6-digit code input */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: 'center',
              mb: 2,
            }}
          >
            {codeDigits.map((digit, index) => (
              <TextField
                key={index}
                id={`digit-${index}`}
                name={`digit-${index}-${Math.random()}`} // random name prevents caching
                autoComplete='off'
                slotProps={{
                  htmlInput: {
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      color: '#003D2C',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      padding: '16px 8px',
                    },
                  },
                  input: {
                    autoComplete: 'new-password', // helps avoid Chrome autofill
                    form: {
                      autoComplete: 'off', // extra fallback
                    },
                  },
                }}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                sx={{
                  width: 56,
                  height: 56,
                  animation: isSubmitting ? `digitPulse 0.6s ease-in-out ${index * 0.1}s` : 'none',
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    '& fieldset': {
                      borderColor: '#003D2C',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#ffc928',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ffc928',
                    },
                  },
                  '@keyframes digitPulse': {
                    '0%': {
                      transform: 'scale(1)',
                      boxShadow: '0 0 0 0 rgba(255, 201, 40, 0.7)',
                    },
                    '25%': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 0 8px rgba(255, 201, 40, 0.4)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 0 12px rgba(255, 201, 40, 0.2)',
                    },
                    '75%': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 0 8px rgba(255, 201, 40, 0.1)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                      boxShadow: '0 0 0 0 rgba(255, 201, 40, 0)',
                    },
                  },
                }}
              />
            ))}
          </Box>

          <Button
            type='submit'
            variant='contained'
            sx={{
              color: 'white',
              padding: '12px 0',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#003D2C',
              },
              '&:disabled': {
                backgroundColor: '#adb8b4',
                color: '#ffffff',
              },
            }}
            disabled={codeDigits.join('').length !== 6}
          >
            Verify
          </Button>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent='center'
          sx={{ mt: 3 }}
        >
          <MuiLink
            component={Link}
            to={`/login-2fa-request-new-code/${userEmail}`}
            underline='hover'
            variant='body2'
          >
            Request new 2FA code
          </MuiLink>
          <MuiLink component={Link} to='/login' underline='hover' variant='body2'>
            Back to login
          </MuiLink>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login2FA;
