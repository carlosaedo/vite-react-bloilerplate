import axios from 'axios';

const apiTorrestir = axios.create({
  //baseURL: 'https://dev-my.torrestir.com/api',
  baseURL: 'http://172.20.1.74:6767',
});

export default apiTorrestir;
