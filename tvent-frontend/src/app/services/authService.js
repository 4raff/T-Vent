// src/authService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authService = {
  // Register/Signup
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Simpan token jika ada
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
  },

  // Get token
  getToken() {
    return localStorage.getItem("token");
  },
};
