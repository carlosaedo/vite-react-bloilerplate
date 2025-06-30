import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  TextField,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const TirCaptcha = ({
  apiInstance,
  antiPhishingKey,
  onValidation,
  onError,
  disabled = false,
  showInput = true,
  label = 'Security Verification',
  size = 'medium',
}) => {
  const [captchaImage, setCaptchaImage] = useState(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const fetchCaptchaImage = async () => {
    setLoading(true);
    setError(null);
    setIsValid(false);
    setCaptchaInput('');

    try {
      const response = await apiInstance.get(
        `/tirCaptcha/get-key?antiPhishingKey=${antiPhishingKey}`,
        {
          responseType: 'blob',
          headers: { Accept: 'image/png' },
        },
      );

      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageObjectURL = URL.createObjectURL(imageBlob);

      setCaptchaImage((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return imageObjectURL;
      });
    } catch (err) {
      const errorMsg = 'Failed to load captcha';
      setError(errorMsg);
      onError?.(errorMsg, err);
      console.error('Error fetching captcha:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateCaptcha = async (tirKey = captchaInput) => {
    if (!tirKey.trim()) {
      const errorMsg = 'Please enter the captcha code';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    }

    setValidating(true);
    setError(null);

    try {
      const response = await apiInstance.post(
        `/tirCaptcha/validate-key?antiPhishingKey=${antiPhishingKey}`,
        { tirKey: tirKey.trim() },
      );

      if (response?.status === 200) {
        setIsValid(true);
        onValidation?.(true, tirKey);
        return true;
      } else {
        const errorMsg = 'Invalid captcha code';
        setError(errorMsg);
        setIsValid(false);
        onValidation?.(false, tirKey);
        onError?.(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMsg = 'Captcha validation failed';
      if (err.response?.status === 400) errorMsg = 'Invalid captcha code';
      else if (err.response?.status === 429) errorMsg = 'Too many attempts. Please try again later';

      setError(errorMsg);
      setIsValid(false);
      onValidation?.(false, tirKey);
      onError?.(errorMsg, err);
      console.error('Error validating captcha:', err);
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleRefresh = () => {
    setCaptchaInput('');
    setIsValid(false);
    fetchCaptchaImage();
  };

  const handleInputChange = (event) => {
    setCaptchaInput(event.target.value);
    setError(null);
    setIsValid(false);
  };

  const handleValidateClick = () => {
    validateCaptcha();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !validating && captchaInput.trim()) {
      validateCaptcha();
    }
  };

  useEffect(() => {
    fetchCaptchaImage();
    return () => {
      if (captchaImage) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, []);

  useEffect(() => {
    if (onValidation) {
      const parentValidate = () => validateCaptcha();
      parentValidate.isValid = isValid;
      parentValidate.captchaValue = captchaInput;
    }
  }, [validateCaptcha, isValid, captchaInput, onValidation]);

  const cardSize =
    size === 'small' ? { maxWidth: 250 } : size === 'large' ? { maxWidth: 450 } : { maxWidth: 350 };

  return (
    <Card variant='outlined' sx={{ mt: 1, opacity: disabled ? 0.6 : 1, ...cardSize }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          {label}
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}

        {error && (
          <Typography
            variant='body2'
            color='error'
            sx={{ textAlign: 'center', p: 1, backgroundColor: '#ffebee', borderRadius: 1, mb: 1 }}
          >
            {error}
          </Typography>
        )}

        {isValid && (
          <Typography
            variant='body2'
            color='success.main'
            sx={{ textAlign: 'center', p: 1, backgroundColor: '#e8f5e8', borderRadius: 1, mb: 1 }}
          >
            ✓ Captcha verified successfully
          </Typography>
        )}

        {captchaImage && !loading && !isValid && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <img
              src={captchaImage}
              alt='Security Captcha'
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
              }}
            />
          </Box>
        )}

        {showInput && captchaImage && !loading && !isValid && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size='small'
              label='Enter code'
              value={captchaInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={disabled || loading || validating}
              error={!!error}
              sx={{ mb: 1 }}
            />
            <Button
              fullWidth
              variant='contained'
              onClick={handleValidateClick}
              disabled={disabled || loading || validating || !captchaInput.trim()}
              size='small'
            >
              {validating ? <CircularProgress size={16} /> : 'Validate'}
            </Button>
          </Box>
        )}
      </CardContent>
      {!loading && !isValid && (
        <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
          <Button
            size='small'
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={disabled || loading || validating}
            variant='outlined'
          >
            Refresh
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export const useTirCaptcha = () => {
  const [captchaRef, setCaptchaRef] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const validateCaptcha = async () => {
    if (captchaRef && typeof captchaRef.validate === 'function') {
      return await captchaRef.validate();
    }
    return false;
  };

  const resetCaptcha = () => {
    if (captchaRef && typeof captchaRef.refresh === 'function') {
      captchaRef.refresh();
    }
  };

  return {
    captchaRef: setCaptchaRef,
    validateCaptcha,
    resetCaptcha,
    isValid,
  };
};

export default TirCaptcha;
