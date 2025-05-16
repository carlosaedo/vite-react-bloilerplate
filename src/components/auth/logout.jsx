import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import authLogout from '../../utils/authLogout';
import { Button, Typography } from '@mui/material';

const Logout = () => {
  const navigateTo = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigateTo('/');
    }
  };

  return (
    <>
      <div
        style={{
          padding: '0px 20px 0 20px',
        }}
      >
        <Typography variant='h6'>You are logged in.</Typography>
        <Button onClick={handleLogout} variant='contained' color='secondary'>
          Logout
        </Button>
      </div>
    </>
  );
};

export default Logout;
