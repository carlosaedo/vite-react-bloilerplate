import { Link } from 'react-router-dom';

const PrimaryMenu = () => {
  return (
    <div className='menu'>
      <Link to='/'>Home</Link>|<Link to='/tracking'>Tracking System</Link>|
      <Link to='/test-type-00'>Test Type 00</Link>|
    </div>
  );
};

export default PrimaryMenu;
