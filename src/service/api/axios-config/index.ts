import axios, { AxiosInstance } from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';
import { Environment } from '@/env';

console.log(Environment.URL_BASE);

const api: AxiosInstance = axios.create({
  baseURL: Environment.URL_BASE,
  headers: {
    'Content-type': 'application/json',
    'X-Frontend-Token': 'frontend',
  },
});

api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export default api;
