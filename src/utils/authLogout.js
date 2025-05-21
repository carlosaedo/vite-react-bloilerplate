import torrestirApi from '../components/api/torrestirApi';

async function logout() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return true;
    }

    /*const response = await torrestirApi.post('/auth/revoke-token', {
      token: token,
    });

    if (!response || !response.data) {
      return false;
    }

    const { revoked } = response.data;

    if (revoked) {
      localStorage.removeItem('token');
      return true;
    }*/

    localStorage.removeItem('token');
    return true;

    //return false;
  } catch (error) {
    if (error.response?.status === 400) {
      localStorage.removeItem('token');
      return true;
    } else if (error.response?.status === 500) {
      return false;
    } else {
      console.error(error);
    }
  }
}

export default logout;
