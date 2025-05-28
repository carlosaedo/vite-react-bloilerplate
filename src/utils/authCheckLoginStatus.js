import torrestirApi from '../components/api/torrestirApi';
import cleanLocalStorage from './cleanLocalStorage';

async function checkLoginStatus() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const response = await torrestirApi.post('/auth/validate-token', {
      token: token,
    });

    if (!response || !response.data || !response.data.isValid) {
      localStorage.removeItem('token');
      cleanLocalStorage();
      return false;
    }
    if (response?.data?.isValid) {
      return true;
    } else {
      localStorage.removeItem('token');
      cleanLocalStorage();
      return false;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      cleanLocalStorage();
      return false;
    } else if (error.response?.status === 500) {
      localStorage.removeItem('token');
      cleanLocalStorage();
      return false;
    } else {
      localStorage.removeItem('token');
      cleanLocalStorage();
      console.error(error);
      return false;
    }
  }
}

export default checkLoginStatus;
