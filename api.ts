import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User } from './types';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
  me: async (): Promise<User> => {
    const response = await api.get('/me');
    return response.data;
  }
};

export const tickets = {
  redeemDefault: async (chave: string) => {
    const response = await api.post('/tickets/descontos', { chave });
    return response.data;
  },
  create: async (data: { 
    tipoHoras: number; 
    timestampEntrada: string; 
    placaDoCarro: string; 
    usarCredito: boolean 
  }) => {
    const response = await api.post('/tickets', data);
    console.log(response);
    return response.data;
  }
};

export default api;
