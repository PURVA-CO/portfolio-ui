import axios from 'axios';

const API = axios.create({
    baseURL : "https://localhost:7000/api",
});

// ✅ Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default API;