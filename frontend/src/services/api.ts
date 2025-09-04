import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const base = rawBase.replace(/\/$/, ''); // quita / final

const api = axios.create({
  baseURL: base.endsWith('/api') ? base : `${base}/api`,
});

// Interceptor: agregar token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    // En Axios v1, headers puede ser AxiosHeaders (tiene .set) o un objeto plano
    const h: any = config.headers;
    if (h && typeof h.set === 'function') {
      h.set('Authorization', `Bearer ${token}`);
    } else {
      h['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor: manejar 401 (token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
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
