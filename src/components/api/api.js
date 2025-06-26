import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.1.74:5151/api/v1',
});

export default api;
