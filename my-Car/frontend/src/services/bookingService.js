import API from './api';

// Create a new booking
const createBooking = async (bookingData) => {
    const response = await API.post('/bookings', bookingData);
    return response.data;
};

// Get current user's bookings
const getUserBookings = async () => {
    const response = await API.get('/bookings/my-bookings');
    return response.data;
};

// Get single booking by ID
const getBookingById = async (bookingId) => {
    const response = await API.get(`/bookings/${bookingId}`);
    return response.data;
};

// Cancel a booking
const cancelBooking = async (bookingId) => {
    const response = await API.put(`/bookings/${bookingId}/cancel`);
    return response.data;
};

const bookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
};

export default bookingService;