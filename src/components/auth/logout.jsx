import { useNavigate } from 'react-router-dom';

import authLogout from '../../utils/authLogout';
import { Button, Typography } from '@mui/material';

import { useContextApi } from '../context/ApiContext';

const Logout = () => {
  const navigateTo = useNavigate();

  const { contextApiData, setContextApiData } = useContextApi();

  const handleLogout = async () => {
    const result = await authLogout();
    if (result) {
      setContextApiData({
        ...contextApiData,
        login: false,
      });
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
        <Typography variant='h6'>Are you sure you want to logout?</Typography>
        <Button onClick={handleLogout} variant='contained' color='secondary'>
          Logout
        </Button>
      </div>
    </>
  );
};

export default Logout;
