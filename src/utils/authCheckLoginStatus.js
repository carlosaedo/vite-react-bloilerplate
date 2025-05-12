import torrestirApi from '../components/api/torrestirApi';

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
      return false;
    }

    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      return false;
    } else if (error.response?.status === 500) {
      return false;
    } else {
      console.error(error);
    }
  }
}

export default checkLoginStatus;
