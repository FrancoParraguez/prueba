import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string = 'user'
): Promise<AuthResponse> => {
  const response = await api.post('auth/register', { name, email, password, role });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('auth/login', { email, password });
  return response.data;
};

export const getProfile = async (): Promise<{ user: User }> => {
  const response = await api.get('auth/profile');
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
