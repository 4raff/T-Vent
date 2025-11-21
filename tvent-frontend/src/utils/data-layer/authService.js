// FILE: src/services/authService.js

import api from './axios';

export const authService = {
  
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      if (data.token) {
        localStorage.setItem("jwtToken", data.token); 
      }
      
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("jwtToken");
  },

  getUserData() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};