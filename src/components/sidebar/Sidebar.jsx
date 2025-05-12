import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PrimaryMenu from '../menus/PrimaryMenu';
import { FaBoxOpen, FaHome, FaRegUserCircle, FaTable } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(() => {
    // Get initial state from localStorage (default to false)
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true';
  });

  // Update localStorage and notify parent on change
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
    onToggle(collapsed ? 60 : 250);
  }, [collapsed, onToggle]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-header'>
        <button className='menu-toggle' onClick={toggleSidebar}>
          ☰
        </button>
      </div>
      <PrimaryMenu />
      <ul>
        <li>
          <NavLink exact='true' to='/' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='icon'>
              <FaHome />
            </span>
            <span className='text'>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to='/tracking' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='icon'>
              <FaBoxOpen />
            </span>
            <span className='text'>Tracking System</span>
          </NavLink>
        </li>
        <li>
          <NavLink to='/test-type-00' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='icon'>
              <FaTable />
            </span>
            <span className='text'>Test Type 00</span>
          </NavLink>
        </li>
        <li>
          <NavLink to='/login' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='icon'>
              <FaRegUserCircle />
            </span>
            <span className='text'>Login</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
