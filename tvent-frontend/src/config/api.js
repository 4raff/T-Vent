// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  // Events
  EVENTS: {
    LIST: '/events',
    GET: (id) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id) => `/events/${id}`,
    DELETE: (id) => `/events/${id}`,
  },
  // Users
  USERS: {
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    GET_PROFILE: '/users/profile',
  },
  // Tickets
  TICKETS: {
    LIST: '/tickets',
    GET: (id) => `/tickets/${id}`,
    CREATE: '/tickets',
  },
  // Bookmarks
  BOOKMARKS: {
    LIST: '/bookmarks',
    CREATE: '/bookmarks',
    DELETE: (id) => `/bookmarks/${id}`,
  },
};
