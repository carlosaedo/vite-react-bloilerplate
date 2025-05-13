import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './PrimaryMenu.css';

const PrimaryMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className='menu-container'>
      {/* Hamburger Icon */}
      <div className='hamburger' onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Menu Links */}
      <div className={`menu ${isMenuOpen ? 'show' : ''}`}>
        <NavLink exact='true' to='/' className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to='/tracking' className={({ isActive }) => (isActive ? 'active' : '')}>
          Tracking System
        </NavLink>
        <NavLink to='/test-type-00' className={({ isActive }) => (isActive ? 'active' : '')}>
          Test Type 00
        </NavLink>
      </div>
    </div>
  );
};

export default PrimaryMenu;
