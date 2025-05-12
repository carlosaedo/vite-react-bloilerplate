import './Header.css';
import LogoTorrestir from '../../assets/Logo-Torrestir-website-1.png';

const Header = () => {
  return (
    <div className='header'>
      <img className='top-logo' src={LogoTorrestir} alt='Torrestir Logo' />
      <span className='logo-span'>W E B S E R V I C E S</span>
    </div>
  );
};

export default Header;
