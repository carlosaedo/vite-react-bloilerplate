import axios from 'axios';

const apiTorrestir = axios.create({
  baseURL: 'https://dev-my.torrestir.com/api',
});

export default apiTorrestir;
