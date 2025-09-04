import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const base = rawBase.replace(/\/$/, '');

const api = axios.create({
  baseURL: base.endsWith('/api') ? base : `${base}/api`,
});

// Agregar token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    const h: any = config.headers;
    if (h && typeof h.set === 'function') {
      h.set('Authorization', `Bearer ${token}`);
    } else {
      h['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Manejar 401
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
