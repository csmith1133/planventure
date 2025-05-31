import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('API Request - Token:', token?.substring(0, 20) + '...');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default api;
