import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PrimaryMenu from '../menus/PrimaryMenu';
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    onToggle(collapsed ? 60 : 250); // Send width to parent
  }, [collapsed, onToggle]);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-header'>
        <button className='menu-toggle' onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>
      </div>
      <PrimaryMenu />
      <ul>
        <li>
          <span className='icon'>🏠</span>
          <NavLink exact='true' to='/' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='text'>Home</span>
          </NavLink>
        </li>
        <li>
          <span className='icon'>⚙️</span>
          <NavLink to='/tracking' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='text'>Tracking System</span>
          </NavLink>
        </li>
        <li>
          <span className='icon'>⚙️</span>
          <NavLink to='/test-type-00' className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className='text'>Test Type 00</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
