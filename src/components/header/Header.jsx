import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import i18n from 'i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  Avatar,
  useMediaQuery,
  FormControl,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Chip,
  InputLabel,
  Popper,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { FaRegUser, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import LogoTorrestir from '../../assets/Logo-Torrestir-website-1.png';
import { useTheme } from '@mui/material/styles';
import torrestirApi from '../api/torrestirApi';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#003D2C',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  minHeight: '64px',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    minHeight: '56px',
    padding: theme.spacing(0, 1),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const NavSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  height: 40,
  width: 'auto',
  backgroundColor: 'transparent',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    height: 32,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: '#ffc928',
  fontWeight: 'bold',
  letterSpacing: 1.5,
  fontSize: '1rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '0.85rem',
  },
}));

const UserChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha('#ffc928', 0.15),
  color: '#ffc928',
  borderRadius: '16px',
  '& .MuiChip-avatar': {
    backgroundColor: alpha('#ffc928', 0.3),
    color: '#003D2C',
  },
  '&:hover': {
    backgroundColor: alpha('#ffc928', 0.25),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root': {
    color: '#ffc928',
    fontSize: '0.9rem',
    '&:before, &:after': {
      borderBottom: 'none',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffc928',
    padding: '6px 8px',
  },
  '& .MuiAutocomplete-endAdornment': {
    color: '#ffc928',
  },
}));

const ClientSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: alpha('#ffc928', 0.1),
  borderRadius: '20px',
  padding: '0 12px',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha('#ffc928', 0.15),
  },
}));

const LanguageSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 65,
  position: 'relative',
  '& .MuiSelect-select': {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 35, // Increased padding to accommodate larger icon
  },
}));

const Header = () => {
  const { user, userRole, checkLoginStatusAuth, loadingAuth, getToken } = useAuth();
  const navigateTo = useNavigate();
  const token = getToken();
  const isTokenPresent = !!token;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [clientOptions, setClientOptions] = useState([]);

  const [inputValue, setInputValue] = useState('');

  // Initialize state from localStorage
  const [selectedClient, setSelectedClient] = useState(() => {
    const savedClient = localStorage.getItem('selectedClient');
    // Try to parse the saved client if it exists
    if (savedClient) {
      try {
        return JSON.parse(savedClient);
      } catch (error) {
        // If parsing fails, return the first client
        console.error('Error parsing selectedClient from localStorage:', error);
        return clientOptions[0];
      }
    }
    // Default to first client if nothing in localStorage
    return clientOptions[0];
  });

  const [selectedAppLanguage, setSelectedAppLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    console.log('Saved language from localStorage:', savedLanguage);
    i18n.changeLanguage(savedLanguage);
    // Default to 'pt' if nothing in localStorage
    return savedLanguage || 'pt';
  });

  async function fetchData() {
    try {
      const response = await torrestirApi.get(`/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        setClientOptions(response.data);
      } else {
        console.error('No data found in response:', response);
        setClientOptions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const loginStatus = await checkLoginStatusAuth();

        if (!loginStatus) {
          navigateTo('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigateTo('/login');
      }
    }
    checkLoginStatus();
    fetchData(); // Call once on mount
  }, []);

  const handleClientChange = (event, newValue) => {
    if (!newValue || !newValue.clientId) return;
    setSelectedClient(newValue);
    localStorage.setItem('selectedClient', JSON.stringify(newValue));
    navigateTo(`/client-details/${newValue.clientId}`);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang); // Change language in i18n
    localStorage.setItem('appLanguage', lang); // Save for next visit
    setSelectedAppLanguage(lang); // Update state in UI
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const displayName = user?.email || localStorage.getItem('userEmail') || 'user';

  if (loadingAuth) return <React.Fragment></React.Fragment>;

  return (
    <StyledAppBar position='sticky'>
      <StyledToolbar>
        {/* Left: Logo */}
        <LogoContainer>
          <StyledAvatar src={LogoTorrestir} alt='Torrestir Logo' variant='square' />
          {/*
          {!isMobile && <StyledTypography>SHIPPING PORTAL</StyledTypography>}*/}
        </LogoContainer>

        {/* Right Section */}
        {isTokenPresent ? (
          <React.Fragment>
            {/* Desktop/Tablet View */}
            {!isMobile ? (
              <NavSection>
                {/* Client Selector */}
                {isTablet
                  ? userRole === 'admin' && (
                      <ClientSelector>
                        <MdBusinessCenter size={18} color='#ffc928' />
                        <Autocomplete
                          options={clientOptions}
                          value={selectedClient || null}
                          onChange={handleClientChange}
                          inputValue={inputValue}
                          onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                          }}
                          onOpen={fetchData}
                          getOptionLabel={(option) => option?.name || ''}
                          isOptionEqualToValue={(option, value) =>
                            option?.clientId === value?.clientId
                          }
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              variant='standard'
                              placeholder='Select client'
                              sx={{ width: 100 }} // Input width
                            />
                          )}
                          sx={{ width: 'auto' }}
                          slots={{
                            popper: Popper, // Default Popper can still be used
                          }}
                          slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: 'setWidth',
                                  enabled: true,
                                  phase: 'beforeWrite',
                                  requires: ['computeStyles'],
                                  fn: ({ state }) => {
                                    state.styles.popper.width = '300px'; // Dropdown width
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ClientSelector>
                    )
                  : userRole === 'admin' && (
                      <ClientSelector>
                        <MdBusinessCenter size={18} color='#ffc928' />
                        <Autocomplete
                          options={clientOptions}
                          value={selectedClient || null}
                          onChange={handleClientChange}
                          inputValue={inputValue}
                          onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                          }}
                          onOpen={() => {
                            fetchData(); // Refetch when dropdown opens
                          }}
                          getOptionLabel={(option) => option?.name || ''}
                          isOptionEqualToValue={(option, value) =>
                            option?.clientId === value?.clientId
                          }
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              variant='standard'
                              placeholder='Select client'
                            />
                          )}
                          sx={{ width: 300 }}
                        />
                      </ClientSelector>
                    )}

                {/* Language Selector */}
                <LanguageSelect variant='standard'>
                  <Select
                    value={selectedAppLanguage || 'pt'}
                    onChange={(event) => handleLanguageChange(event.target.value)}
                    disableUnderline
                    sx={{
                      color: '#ffc928',
                      fontSize: '0.875rem',
                      '& .MuiSelect-icon': { color: '#ffc928' },
                    }}
                    IconComponent={(props) => (
                      <Box
                        component='span'
                        sx={{
                          display: 'flex',
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <FaGlobe size={16} color='#ffc928' />
                      </Box>
                    )}
                  >
                    <MenuItem value='pt'>PT</MenuItem>
                    <MenuItem value='en'>EN</MenuItem>
                    <MenuItem value='jp'>JP</MenuItem>
                  </Select>
                </LanguageSelect>

                {/* User Info */}
                <UserChip
                  avatar={
                    <Avatar>
                      <FaRegUser size={14} />
                    </Avatar>
                  }
                  label={`${displayName.split('@')[0]} | ${userRole || 'user'}`}
                  component={Link}
                  to='/login'
                  clickable
                />
              </NavSection>
            ) : (
              /* Mobile View - Hamburger Menu */
              <IconButton onClick={toggleDrawer} sx={{ color: '#ffc928' }}>
                <FaBars size={20} />
              </IconButton>
            )}

            {/* Mobile Drawer */}
            <Drawer
              anchor='right'
              open={drawerOpen && isMobile}
              onClose={toggleDrawer}
              slotProps={{
                paper: {
                  sx: {
                    width: '80%',
                    maxWidth: '300px',
                    backgroundColor: '#003D2C',
                    color: '#ffc928',
                  },
                },
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={toggleDrawer} sx={{ color: '#ffc928' }}>
                  <FaTimes size={20} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  src={LogoTorrestir}
                  alt='Torrestir Logo'
                  variant='square'
                  sx={{ height: 60, width: 'auto' }}
                />
              </Box>

              <Divider sx={{ bgcolor: alpha('#ffc928', 0.2) }} />

              <Box sx={{ p: 2 }}>
                <UserChip
                  avatar={
                    <Avatar>
                      <FaRegUser size={14} />
                    </Avatar>
                  }
                  label={`${displayName.split('@')[0]} | ${userRole || 'user'}`}
                  sx={{ width: '100%', justifyContent: 'flex-start', py: 1 }}
                  component={Link}
                  to='/login'
                  clickable
                />
              </Box>

              <List>
                {userRole === 'admin' && (
                  <React.Fragment>
                    <ListItem>
                      <ListItemText
                        primary='Client'
                        slotProps={{
                          typography: {
                            sx: { color: alpha('#ffc928', 0.7), fontSize: '0.8rem' },
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ pt: 0 }}>
                      <Autocomplete
                        options={clientOptions}
                        value={selectedClient || null}
                        onChange={handleClientChange}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        onOpen={() => {
                          fetchData();
                        }}
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) =>
                          option?.clientId === value?.clientId
                        }
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            variant='standard'
                            placeholder='Select client'
                          />
                        )}
                        sx={{ width: 300 }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 2, bgcolor: alpha('#ffc928', 0.2) }} />
                  </React.Fragment>
                )}
                <ListItem>
                  <ListItemText
                    primary='Language'
                    slotProps={{
                      typography: {
                        sx: { color: alpha('#ffc928', 0.7), fontSize: '0.8rem' },
                      },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {['pt', 'en', 'jp'].map((lang) => (
                      <Chip
                        key={lang}
                        label={lang.toUpperCase()}
                        onClick={() => handleLanguageChange(lang)}
                        sx={{
                          bgcolor:
                            selectedAppLanguage === lang
                              ? alpha('#ffc928', 0.3)
                              : alpha('#ffc928', 0.1),
                          color: '#ffc928',
                          fontWeight: selectedAppLanguage === lang ? 'bold' : 'normal',
                        }}
                      />
                    ))}
                  </Box>
                </ListItem>
              </List>
            </Drawer>
          </React.Fragment>
        ) : (
          <MuiLink
            component={Link}
            to='/login'
            underline='none'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#ffc928',
              backgroundColor: alpha('#ffc928', 0.1),
              px: 2,
              py: 0.5,
              borderRadius: 4,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: alpha('#ffc928', 0.2),
              },
            }}
          >
            <FaRegUser size={14} />
            <Typography variant='button'>Login</Typography>
          </MuiLink>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;
