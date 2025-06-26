// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  logout: () => api.post('/logout/'),
  getProfile: () => api.get('/profile/'),
  updateProfile: (profileData) => api.put('/profile/', profileData),
  getAllProfiles: () => api.get('/profiles/'),
};