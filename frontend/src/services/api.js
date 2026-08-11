import axios from 'axios';

// Create an axios instance with a custom config
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // இது /api மற்றும் /api/v1 இரண்டையும் பேக்என்டில் சப்போர்ட் செய்யும்
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token to headers if available
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle global errors (e.g., unauthorized)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;