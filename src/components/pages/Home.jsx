import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import {
  FaRegUser,
  FaShippingFast,
  FaCheck,
  FaMoneyCheckAlt,
  FaExclamation,
  FaArrowRight,
} from 'react-icons/fa';
import { MdOutlineLocalShipping, MdDashboard, MdOutlineEuro, MdArrowUpward } from 'react-icons/md';
import { useTheme } from '@mui/material/styles';

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 62, 45, 0.15)',
  background: 'linear-gradient(135deg, #003D2C 0%, #005540 100%)',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255, 201, 40, 0.1) 0%, rgba(255, 201, 40, 0) 100%)',
    borderTopLeftRadius: '100%',
    borderBottomLeftRadius: '100%',
  },
}));

const StatsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StatsCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'progress' && prop !== 'bgColor',
})(({ progress = 0, bgColor = alpha('#003D2C', 0.05) }) => ({
  borderRadius: '12px',
  height: '100%',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  background: `linear-gradient(to right, ${bgColor} ${progress}%, white ${progress}%)`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#003D2C',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StatTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: alpha('#000', 0.7),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StatIcon = styled(Avatar)(({ theme, bgcolor = '#003D2C' }) => ({
  backgroundColor: bgcolor,
  color: 'white',
  width: 42,
  height: 42,
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: alpha('#ffc928', 0.8),
  color: '#003D2C',
  width: 56,
  height: 56,
  fontWeight: 'bold',
  fontSize: '1.5rem',
  boxShadow: `0 4px 10px ${alpha('#000', 0.15)}`,
}));

const GuestContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #f9f9f9 0%, #f1f1f1 100%)',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  maxWidth: '600px',
  margin: '0 auto',
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: 'linear-gradient(45deg, #003D2C 0%, #005540 100%)',
  borderRadius: '24px',
  padding: theme.spacing(1, 4),
  color: '#fff',
  fontWeight: 'medium',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #00513a 0%, #006b50 100%)',
    boxShadow: '0 4px 15px rgba(0, 62, 45, 0.3)',
  },
}));

const TrendChip = styled(Chip)(({ theme, trend = 'up' }) => ({
  backgroundColor: trend === 'up' ? alpha('#4caf50', 0.1) : alpha('#f44336', 0.1),
  color: trend === 'up' ? '#4caf50' : '#f44336',
  fontWeight: 'bold',
  fontSize: '0.7rem',
  height: 20,
  '& .MuiChip-icon': {
    fontSize: '0.7rem',
  },
}));

// Define colors for each stats card
const statColors = {
  reservations: '#003D2C', // Primary green
  prices: '#ffc928', // Gold
  accepted: '#4caf50', // Success green
  delivered: '#2196f3', // Info blue
  planned: '#ff9800', // Warning orange
  incidents: '#f44336', // Error red
};

const Home = () => {
  const { getToken } = useAuth();
  const navigateTo = useNavigate();
  const token = getToken();
  const isTokenPresent = !!token;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [userInfo] = useState(() => {
    if (token) {
      return jwtDecode(token);
    }
    return {};
  });

  const displayName = userInfo?.email || localStorage.getItem('userEmail') || 'user';
  const userRole = userInfo?.typ || 'user';

  // Simulated progress values for stats cards (for visual effect)
  const progressValues = {
    reservations: 80,
    prices: 80,
    accepted: 80,
    delivered: 80,
    planned: 80,
    incidents: 80,
  };

  return (
    <DashboardContainer>
      {isTokenPresent ? (
        <React.Fragment>
          <WelcomeCard elevation={0}>
            <Grid container spacing={3} alignItems='center'>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <UserAvatar>{displayName?.charAt(0).toUpperCase() || 'U'}</UserAvatar>
                  <Box>
                    <Typography variant='h5' fontWeight='bold' sx={{ mb: 0.5 }}>
                      Welcome, {displayName?.split('@')[0] || 'User'}
                    </Typography>
                    <Chip
                      label={userRole}
                      size='small'
                      sx={{
                        backgroundColor: alpha('#ffc928', 0.2),
                        color: '#ffc928',
                        fontWeight: 'medium',
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography
                  variant='subtitle2'
                  sx={{ opacity: 0.85, fontSize: '0.85rem', mb: 0.5 }}
                >
                  Tuesday, May 20, 2025
                </Typography>
                <Button
                  endIcon={<FaArrowRight />}
                  sx={{
                    color: '#ffc928',
                    backgroundColor: alpha('#ffc928', 0.1),
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    mt: 1,
                    '&:hover': {
                      backgroundColor: alpha('#ffc928', 0.2),
                    },
                  }}
                >
                  View Activity
                </Button>
              </Grid>
            </Grid>
          </WelcomeCard>

          <Typography
            variant='h6'
            sx={{
              mb: 3,
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              color: '#003D2C',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <MdDashboard size={24} />
            Shipping Control Panel
          </Typography>

          <StatsGrid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                progress={progressValues.reservations}
                bgColor={alpha(statColors.reservations, 0.075)}
              >
                <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                      <StatTitle>Reservas feitas hoje</StatTitle>
                      <StatValue component='div'>
                        5
                        <TrendChip size='small' icon={<MdArrowUpward />} label='+10%' />
                      </StatValue>
                    </Box>
                    <StatIcon bgcolor={statColors.reservations}>
                      <MdDashboard size={24} />
                    </StatIcon>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard progress={progressValues.prices} bgColor={alpha(statColors.prices, 0.075)}>
                <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                      <StatTitle>Pedidos de preço feitos hoje</StatTitle>
                      <StatValue component='div'>
                        5
                        <TrendChip size='small' icon={<MdArrowUpward />} label='+10%' />
                      </StatValue>
                    </Box>
                    <StatIcon bgcolor={statColors.prices}>
                      <FaMoneyCheckAlt size={22} />
                    </StatIcon>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                progress={progressValues.accepted}
                bgColor={alpha(statColors.accepted, 0.075)}
              >
                <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                      <StatTitle>Envios aceites</StatTitle>
                      <StatValue>2</StatValue>
                    </Box>
                    <StatIcon bgcolor={statColors.accepted}>
                      <FaCheck size={22} />
                    </StatIcon>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                progress={progressValues.delivered}
                bgColor={alpha(statColors.delivered, 0.075)}
              >
                <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                      <StatTitle>Envios entregues</StatTitle>
                      <StatValue>1</StatValue>
                    </Box>
                    <StatIcon bgcolor={statColors.delivered}>
                      <FaShippingFast size={22} />
                    </StatIcon>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                progress={progressValues.planned}
                bgColor={alpha(statColors.planned, 0.075)}
              >
                <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                      <StatTitle>Envios planeados</StatTitle>
                      <StatValue>3</StatValue>
                    </Box>
                    <StatIcon bgcolor={statColors.planned}>
                      <MdOutlineLocalShipping size={22} />
                    </StatIcon>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsCard
                progress={progressValues.incidents}
                bgColor={alpha(statColors.incidents, 0.075)}
              >
                <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
                  <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                      <StatTitle>Número incidencias</StatTitle>
                      <StatValue>2</StatValue>
                    </Box>
                    <StatIcon bgcolor={statColors.incidents}>
                      <FaExclamation size={22} />
                    </StatIcon>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Grid>
          </StatsGrid>
        </React.Fragment>
      ) : (
        <GuestContainer>
          <Box sx={{ mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: '#003D2C',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <MdOutlineLocalShipping size={40} />
            </Avatar>
          </Box>
          <Typography
            variant='h4'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #003D2C 30%, #008056 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Welcome to the Shipping Portal
          </Typography>
          <Typography
            variant='body1'
            sx={{ color: alpha('#000', 0.7), maxWidth: '400px', mx: 'auto' }}
          >
            Sign in to access your dashboard and manage all your shipping needs in one place.
          </Typography>
          <LoginButton
            variant='contained'
            startIcon={<FaRegUser />}
            onClick={() => {
              navigateTo('/login');
            }}
          >
            Login to your account
          </LoginButton>
        </GuestContainer>
      )}
    </DashboardContainer>
  );
};

export default Home;
