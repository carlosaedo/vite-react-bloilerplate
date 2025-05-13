import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBoxOpen, FaHome, FaRegUserCircle, FaTable } from 'react-icons/fa';
import './Sidebar.css';
import authCheckLoginStatus from '../../utils/authCheckLoginStatus';

import { useContextApi } from '../context/ApiContext';

const Sidebar = ({ onToggle }) => {
  const { contextApiData, setContextApiData } = useContextApi();

  const [collapsed, setCollapsed] = useState(() => {
    // Get initial state from localStorage (default to false)
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true';
  });

  const [loginStatus, setLoginStatus] = useState(false);

  // Update localStorage and notify parent on change
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
    onToggle(collapsed ? 60 : 250);

    async function checkLoginStatus() {
      const isLoggedIn = await authCheckLoginStatus();
      setLoginStatus(isLoggedIn); // <- always set the result
    }

    checkLoginStatus();
  }, [collapsed, onToggle, contextApiData?.login]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleSidebarMenuItem = () => {
    if (!collapsed) {
      setCollapsed(true);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-header'>
        <button className='menu-toggle' onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <ul>
        {loginStatus ? (
          <>
            <li>
              <NavLink
                exact='true'
                to='/'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaHome />
                </span>
                <span className='text'>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/tracking'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaBoxOpen />
                </span>
                <span className='text'>Tracking System</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/test-type-00'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaTable />
                </span>
                <span className='text'>Test Type 00</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/login'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaRegUserCircle />
                </span>
                <span className='text'>{loginStatus ? 'Logout' : 'Login'}</span>
              </NavLink>
            </li>{' '}
          </>
        ) : (
          <>
            <li>
              <NavLink
                exact='true'
                to='/'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaHome />
                </span>
                <span className='text'>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/tracking'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaBoxOpen />
                </span>
                <span className='text'>Tracking System</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/login'
                onClick={toggleSidebarMenuItem}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className='icon'>
                  <FaRegUserCircle />
                </span>
                <span className='text'>{loginStatus ? 'Logout' : 'Login'}</span>
              </NavLink>
            </li>{' '}
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
