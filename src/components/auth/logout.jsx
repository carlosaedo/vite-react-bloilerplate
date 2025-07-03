import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authLogout from '../../utils/authLogout';

import { Box, Paper, Typography, Button, Stack, Avatar } from '@mui/material';

import { styled, alpha } from '@mui/material/styles';
import { FaRegUser, FaUsers } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

import { useConfirm } from '../context/ConfirmationModalContext';

const LogoutCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  maxWidth: 500,
  width: '100%',
  boxShadow: '0 8px 20px rgba(0, 62, 45, 0.15)',
  background: 'linear-gradient(135deg, #f9f9f9 0%, #f1f1f1 100%)',
}));

const Label = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#003D2C',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Value = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#005540',
  fontSize: '1rem',
}));

const SessionInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: alpha('#000', 0.7),
  textAlign: 'center',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f44336 0%, #d32f2f 100%)',
  borderRadius: '12px',
  color: '#fff',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #d32f2f 0%, #b71c1c 100%)',
    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
  },
}));

const Logout = ({ userInfoData }) => {
  const navigateTo = useNavigate();
  const { logout, avatar } = useAuth();
  const confirm = useConfirm();

  function convertUnixToReadable(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  const handleLogout = async () => {
    const confirmed = await confirm({
      message: 'Are you sure you want to leave? ',
      title: 'Logout Confirmation',
      confirmText: 'Logout',
      cancelText: 'Stay Logged In',
      severity: 'warning',
    });
    if (!confirmed) return;
    const result = await logout();
    if (result) {
      navigateTo('/');
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <LogoutCard elevation={0}>
        <Stack spacing={3} alignItems='center'>
          {avatar ? (
            <img
              src={avatar}
              alt='Avatar'
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: '#003D2C',
                color: '#fff',
                fontSize: '1.5rem',
                boxShadow: `0 4px 10px ${alpha('#000', 0.2)}`,
              }}
            >
              <FaRegUser />
            </Avatar>
          )}

          <Label variant='h6'>
            <FaRegUser /> Logged in as:
          </Label>
          <Value>{userInfoData?.email || localStorage.getItem('userEmail') || 'User'}</Value>

          <Label variant='h6'>
            <FaUsers /> Role:
          </Label>
          <Value>{userInfoData?.typ}</Value>

          <SessionInfo>
            Session valid until:
            <br />
            <strong>{convertUnixToReadable(userInfoData?.exp)}</strong>
          </SessionInfo>

          <LogoutButton
            variant='contained'
            onClick={handleLogout}
            fullWidth
            startIcon={<FiLogOut />}
          >
            Logout
          </LogoutButton>
        </Stack>
      </LogoutCard>
    </Box>
  );
};

export default Logout;
