import axios from 'axios';

// Vite default or env baseURL
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Authorization header if session token is available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sumant_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBiodata = async () => {
  const response = await client.get('/biodata');
  return response.data;
};

export const getReference = async () => {
  const response = await client.get('/reference');
  return response.data;
};

export const postMatch = async (payload) => {
  const response = await client.post('/match', payload);
  return response.data;
};

export const getMatches = async () => {
  const response = await client.get('/matches');
  return response.data;
};

export const getMatchById = async (id) => {
  const response = await client.get(`/matches/${id}`);
  return response.data;
};

export const deleteMatch = async (id) => {
  const response = await client.delete(`/matches/${id}`);
  return response.data;
};

// Admin 2-Step OTP Authentication
export const loginStep1 = async (password) => {
  const response = await client.post('/auth/login-step1', { password });
  return response.data;
};

export const verifyOtp = async (otp) => {
  const response = await client.post('/auth/verify-otp', { otp });
  return response.data;
};

export const checkSession = async () => {
  const response = await client.get('/auth/check-session');
  return response.data;
};

export const logoutAdmin = async () => {
  try {
    await client.post('/auth/logout');
  } finally {
    localStorage.removeItem('sumant_admin_token');
    localStorage.removeItem('sumant_admin_email');
  }
};

export default client;
