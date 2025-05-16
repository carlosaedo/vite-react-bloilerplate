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
} from '@mui/material';
import { FaBoxOpen, FaHome, FaRegUserCircle, FaTable, FaUserCircle } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true';
  });

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
    onToggle(collapsed ? 50 : 250);
  }, [collapsed, onToggle]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleSidebarMenuItem = () => {
    if (!collapsed) {
      setCollapsed(true);
    }
  };

  return (
    <Drawer
      variant='persistent'
      open={true}
      className={collapsed ? 'sidebar-collapsed' : ''}
      sx={{
        width: collapsed ? 50 : 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 50 : 250,
          backgroundColor: '#ffffff',
          color: '#003e2d',
          transition: 'width 0.3s ease',
          position: 'fixed',
          top: 0,
        },
      }}
    >
      <div className='sidebar-header'>
        <IconButton
          onClick={toggleSidebar}
          sx={{
            height: '45px',
            width: '45px',
            background: 'none',
            border: 'none',
            color: '#003e2d',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              backgroundColor: '#003e2d18',
              transform: 'scale(1.1)',
            },
            marginTop: '10px',
          }}
        >
          ☰
        </IconButton>
      </div>

      <List>
        {isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FaHome />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary='Home'
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/tracking'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FaBoxOpen />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary='Tracking System'
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/test-type-00'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FaTable />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary='Test Type 00'
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/login'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon className={isLoggedIn ? 'logged-in' : ''} sx={{ minWidth: '30px' }}>
                  <FaUserCircle />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary={isLoggedIn ? 'Logout' : 'Login'}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FaHome />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary='Home'
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/tracking'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FaBoxOpen />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary='Tracking System'
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to='/login'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FaRegUserCircle />
                </ListItemIcon>
                <ListItemText
                  className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                  primary={isLoggedIn ? 'Logout' : 'Login'}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
