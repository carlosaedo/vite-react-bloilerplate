import { useNavigate } from 'react-router-dom';

import authLogout from '../../utils/authLogout';

import { useContextApi } from '../context/ApiContext';

const Logout = () => {
  const navigateTo = useNavigate();

  const { contextApiData, setContextApiData } = useContextApi();

  const handleLogout = async () => {
    const result = await authLogout();
    if (result) {
      setContextApiData({
        ...contextApiData,
        login: false,
      });
      navigateTo('/');
    }
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
