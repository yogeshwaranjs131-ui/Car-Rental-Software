import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get admin dashboard statistics
const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
    return response.data;
};

// Get all users (Admin)
const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, getAuthHeader());
    return response.data;
};

// Delete user (Admin)
const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeader());
    return response.data;
};

// Get all bookings (Admin)
const getAllBookings = async () => {
    const response = await axios.get(`${API_URL}/bookings`, getAuthHeader());
    return response.data;
};

// Update booking status (Admin)
const updateBookingStatus = async (bookingId, status) => {
    const response = await axios.put(`${API_URL}/bookings/${bookingId}`, { status }, getAuthHeader());
    return response.data;
};

const adminService = {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    getAllBookings,
    updateBookingStatus
};

export default adminService;