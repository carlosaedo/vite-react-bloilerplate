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
  CircularProgress,
  Collapse,
  Box,
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
  FaChevronDown,
  FaChevronRight as FaChevronUp,
} from 'react-icons/fa';

import { GrUserNew } from 'react-icons/gr';

import { MdSupervisorAccount } from 'react-icons/md';
import { RiPagesLine } from 'react-icons/ri';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true';
  });

  const { isLoggedIn, loadingAuth, userRole } = useAuth();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
    onToggle(collapsed ? 55 : 250);

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

  const [openGroups, setOpenGroups] = useState(() => {
    const savedState = JSON.parse(localStorage.getItem('openGroups'));
    return savedState ? savedState : {};
  });

  const handleToggleGroup = (label) => {
    setOpenGroups((prev) => {
      const updated = { ...prev, [label]: !prev[label] };
      localStorage.setItem('openGroups', JSON.stringify(updated));
      return updated;
    });
  };

  const allItems = [
    { label: 'Home', icon: <FaHome />, path: '/', roles: ['user', 'admin', 'client'] },
    {
      label: 'Clients',
      icon: <MdSupervisorAccount />,
      roles: ['user', 'admin', 'client'],
      children: [
        {
          label: 'Client Details',
          icon: <MdSupervisorAccount />,
          path: '/client-details',
          roles: ['user', 'admin'],
        },
        {
          label: 'Create New Client',
          icon: <GrUserNew />,
          path: '/client-new',
          roles: ['admin'],
        },
      ],
    },
    {
      label: 'Shipping Form',
      icon: <RiPagesLine />,
      path: '/shipping-form',
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

  const filterByRole = (items) =>
    items
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterByRole(item.children);
          return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
        }
        return item;
      })
      .filter(Boolean);

  const filteredItems = filterByRole(allItems);

  const renderMenuItem = ({ label, icon, path }) => (
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
            sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem', fontWeight: 400 } }}
            className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
            primary={label}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );

  const renderMenu = () =>
    filteredItems.map((item) => {
      if (item.children) {
        const isOpen = openGroups[item.label] || false;
        return (
          <React.Fragment key={item.label}>
            <ListItem disablePadding>
              <Tooltip title={collapsed ? item.label : ''} placement='right' arrow>
                <ListItemButton onClick={() => handleToggleGroup(item.label)}>
                  <ListItemIcon sx={{ minWidth: collapsed ? '24px' : '35px' }}>
                    {item.icon}
                    {collapsed && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 6,
                          height: 6,
                          backgroundColor: isOpen ? '#FFC928' : '#888',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    className={collapsed ? 'sidebar-collapsed-text' : 'sidebar-expanded-text'}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem', fontWeight: 400 } }}
                  />
                  {!collapsed && (isOpen ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />)}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <Collapse in={isOpen} timeout='auto' unmountOnExit>
              <List component='div' disablePadding sx={{ pl: collapsed ? 0 : 1 }}>
                {item.children.map(renderMenuItem)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
      return renderMenuItem(item);
    });

  if (loadingAuth) {
    return (
      <CircularProgress
        sx={{
          position: 'fixed',
          top: 15,
          left: 2,
        }}
      />
    );
  }

  return (
    <Drawer
      variant='persistent'
      open={true}
      className={collapsed ? 'sidebar-collapsed' : ''}
      sx={{
        width: collapsed ? 55 : 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 55 : 250,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'fixed',
          top: 0,
          height: '100%',
          zIndex: 1200,
          overflow: 'hidden', // Do not scroll the paper itself
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 1, // add slight padding to avoid scrollbar overlay
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
      </Box>
    </Drawer>
  );
};

export default Sidebar;
