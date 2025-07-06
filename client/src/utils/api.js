import axios from 'axios';

// Use relative URLs in production, full URLs in development
const API_BASE_URL = import.meta.env.PROD 
  ? '' // Use relative URLs in production (same domain)
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
