import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, Paper, Typography, Button, Stack, Grid, Divider } from '@mui/material';
import { FaRegUser, FaShippingFast, FaCheck, FaMoneyCheckAlt, FaExclamation } from 'react-icons/fa';
import { MdOutlineLocalShipping, MdDashboard, MdOutlineEuro } from 'react-icons/md';

const Incidents = () => {
  const token = localStorage.getItem('token');
  const isTokenPresent = !!token;

  const [userInfo] = useState(() => {
    if (token) {
      return jwtDecode(token);
    }
    return {};
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h5'>Incidents works</Typography>
    </Box>
  );
};

export default Incidents;
