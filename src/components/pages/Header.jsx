import PrimaryMenu from '../menus/PrimaryMenu';
import './Header.css';
import LogoTorrestir from '../../assets/Logo-Torrestir-website-1.png';

const Header = () => {
  return (
    <div className='header'>
      <img className='top-logo' src={LogoTorrestir} alt='Torrestir Logo' />
      <PrimaryMenu />
    </div>
  );
};

export default Header;
