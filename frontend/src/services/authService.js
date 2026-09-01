import API from './api';

// Register user
const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await API.post('/auth/login', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Forgot password
const forgotPassword = async (emailData) => {
    const response = await API.post('/auth/forgot-password', emailData);
    return response.data;
};

// Reset password
const resetPassword = async (token, passwordData) => {
    const response = await API.put(`/auth/reset-password/${token}`, passwordData);
    return response.data;
};

// Get current logged-in user profile
const getProfile = async () => {
    const response = await API.get('/users/profile');
    return response.data;
};

// Update user profile
const updateProfile = async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile
};

export default authService;