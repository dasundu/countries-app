// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'countries-app-production-49e4.up.railway.app';

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/signup`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get user from local storage
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
};