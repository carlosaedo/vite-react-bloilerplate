import axios from 'axios';

const apiTorrestir = axios.create({
  baseURL: 'https://www.torrestir.com/api',
});

export default apiTorrestir;
