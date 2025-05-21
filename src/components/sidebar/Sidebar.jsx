import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  FaBoxOpen,
  FaHome,
  FaRegUserCircle,
  FaTable,
  FaUserCircle,
  FaExclamation,
  FaBars,
  FaChevronRight,
} from 'react-icons/fa';
import { GrUserNew } from 'react-icons/gr';

import { MdSupervisorAccount } from 'react-icons/md';
import './Sidebar.css';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true';
  });

  const [userInfo, setUserInfo] = useState(null);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
    onToggle(collapsed ? 60 : 250);

    // Force collapse on mobile
    const handleResize = () => {
      if (window.innerWidth <= 768 && !collapsed) {
        setCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, onToggle]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleSidebarMenuItem = () => {
    if (!collapsed) {
      setCollapsed(true);
    }
  };

  const allItems = [
    { label: 'Home', icon: <FaHome />, path: '/', roles: ['user', 'admin', 'client'] },
    {
      label: 'Client Details',
      icon: <MdSupervisorAccount />,
      path: '/client-details',
      roles: ['user', 'admin', 'client'],
    },
    {
      label: 'Create New Client',
      icon: <GrUserNew />,
      path: '/client-new',
      roles: ['user', 'admin', 'client'],
    },
    {
      label: 'Tracking',
      icon: <FaBoxOpen />,
      path: '/tracking',
      roles: ['user', 'admin', 'client'],
    },
    { label: 'Test Type 00', icon: <FaTable />, path: '/test-type-00', roles: ['user', 'admin'] },
    { label: 'Incidents', icon: <FaExclamation />, path: '/incidents', roles: ['user', 'admin'] },
  ];

  const filteredItems = allItems.filter(
    (item) => !item.roles || item.roles.includes(userInfo?.typ),
  );

  const renderMenu = () =>
    filteredItems.map(({ label, icon, path }) => (
      <ListItem disablePadding key={label}>
        <Tooltip title={collapsed ? label : ''} placement='right' arrow>
          <ListItemButton
            component={NavLink}
            to={path}
            onClick={toggleSidebarMenuItem}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? '24px' : '35px' }}>{icon}</ListItemIcon>
            <ListItemText
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  transition: 'color 0.2s ease',
                },
              }}
              className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
              primary={label}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>
    ));

  return (
    <Drawer
      variant='persistent'
      open={true}
      className={collapsed ? 'sidebar-collapsed' : ''}
      sx={{
        width: collapsed ? 60 : 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 60 : 250,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'fixed',
          top: 0,
          height: '100%',
          zIndex: 1200,
        },
      }}
    >
      <div className='sidebar-header'>
        <IconButton
          onClick={toggleSidebar}
          sx={{
            height: '40px',
            width: '40px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            margin: '8px',
            color: '#003D2C',
          }}
        >
          {collapsed ? <FaBars size={16} /> : <FaChevronRight size={16} />}
        </IconButton>
      </div>

      <List>
        {isLoggedIn ? (
          <>
            {renderMenu()}

            <ListItem disablePadding sx={{ marginTop: 'auto' }}>
              <Tooltip
                title={collapsed ? (isLoggedIn ? 'Logout' : 'Login') : ''}
                placement='right'
                arrow
              >
                <ListItemButton
                  component={NavLink}
                  to='/login'
                  onClick={toggleSidebarMenuItem}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  sx={{ marginTop: '12px' }}
                >
                  <ListItemIcon
                    className={isLoggedIn ? 'logged-in' : ''}
                    sx={{ minWidth: collapsed ? '24px' : '35px' }}
                  >
                    <FaUserCircle />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        transition: 'color 0.2s ease',
                      },
                    }}
                    className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                    primary={isLoggedIn ? 'Logout' : 'Login'}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding sx={{ marginTop: 'auto' }}>
              <Tooltip title='Home' placement='right' arrow>
                <ListItemButton
                  component={NavLink}
                  to='/'
                  onClick={toggleSidebarMenuItem}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? '24px' : '35px' }}>
                    <FaHome />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        transition: 'color 0.2s ease',
                      },
                    }}
                    className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                    primary='Home'
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding sx={{ marginTop: 'auto' }}>
              <Tooltip title={collapsed ? 'Login' : ''} placement='right' arrow>
                <ListItemButton
                  component={NavLink}
                  to='/login'
                  onClick={toggleSidebarMenuItem}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? '24px' : '35px' }}>
                    <FaRegUserCircle />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        transition: 'color 0.2s ease',
                      },
                    }}
                    className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                    primary={isLoggedIn ? 'Logout' : 'Login'}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
