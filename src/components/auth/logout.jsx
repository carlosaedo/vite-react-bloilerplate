import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigateTo = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigateTo('/login');
  };

  return (
    <>
      <div>
        <h2>Tem a certeza que deseja sair?</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Logout;
