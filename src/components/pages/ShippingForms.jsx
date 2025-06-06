import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, Paper, Typography, Button, Stack, Grid, Divider } from '@mui/material';
import { FaRegUser, FaShippingFast, FaCheck, FaMoneyCheckAlt, FaExclamation } from 'react-icons/fa';
import { MdOutlineLocalShipping, MdDashboard, MdOutlineEuro } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const ShippingForms = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const isTokenPresent = !!token;

  const [userInfo] = useState(() => {
    if (token) {
      return jwtDecode(token);
    }
    return {};
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h5'>Shipping forms works</Typography>
    </Box>
  );
};

export default ShippingForms;
