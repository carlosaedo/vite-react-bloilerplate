import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import authLogout from '../../utils/authLogout';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

import { FaRegUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Logout = ({ userInfoData }) => {
  const navigateTo = useNavigate();

  function convertUnixToReadable(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigateTo('/');
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Stack spacing={3} alignItems='center'>
          <Typography variant='h6' textAlign='center'>
            <FaRegUser /> Logged in as:
          </Typography>
          <Typography variant='body1' color='primary' fontWeight='bold'>
            {userInfoData?.email}
          </Typography>
          <Typography variant='body2' textAlign='center'>
            Session valid until:
            <br />
            <strong>{convertUnixToReadable(userInfoData?.exp)}</strong>
          </Typography>
          <Button variant='contained' color='secondary' onClick={handleLogout} fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FiLogOut />
              Logout
            </Box>
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Logout;
