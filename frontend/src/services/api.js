import axios from 'axios';

// ==========================================
// API BASE URL
// ==========================================

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        'https://car-rental-software.onrender.com/api',

    headers: {
        'Content-Type': 'application/json',
    },

    timeout: 30000,
});

// ==========================================
// REQUEST INTERCEPTOR
// Add JWT token automatically
// ==========================================

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// ==========================================
// RESPONSE INTERCEPTOR
// Handle common API errors
// ==========================================

API.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status = error.response?.status;

        // ======================================
        // Unauthorized
        // ======================================

        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.dispatchEvent(
                new Event('authChange')
            );

            // Avoid redirect loop
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // ======================================
        // Forbidden
        // ======================================

        if (status === 403) {
            console.error(
                'Access denied:',
                error.response?.data
            );
        }

        // ======================================
        // Not Found
        // ======================================

        if (status === 404) {
            console.error(
                'API endpoint not found:',
                error.config?.url
            );
        }

        // ======================================
        // Server Error
        // ======================================

        if (status >= 500) {
            console.error(
                'Server error:',
                error.response?.data
            );
        }

        return Promise.reject(error);
    }
);

export default API;