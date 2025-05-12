import torrestirApi from '../components/api/torrestirApi';
const token = localStorage.getItem('token');

if (!token) {
  return false;
}

async function checkLoginStatus() {
  try {
    const response = await torrestirApi.get('/auth/check-authentication-status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      if (!response.data.isValid) {
        return false;
      }
      return true;
    }
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
