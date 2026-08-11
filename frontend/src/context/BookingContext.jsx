import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create Booking Context
const BookingContext = createContext();

const API_BASE_URL = 'http://localhost:5000';

// Booking Provider Component
export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all bookings for the logged-in user
    const fetchUserBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            // 🛠️ /api/v1/ என்று மாற்றப்பட்டுள்ளது
            const response = await axios.get(`${API_BASE_URL}/api/v1/bookings/my-bookings`, config);
            setBookings(response.data.data || response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    // Create a new booking
    const createBooking = async (bookingData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            // 🛠️ /api/v1/bookings என்று மாற்றப்பட்டுள்ளது
            const response = await axios.post(`${API_BASE_URL}/api/v1/bookings`, bookingData, config);
            
            const newBooking = response.data.data || response.data;
            setBookings((prevBookings) => [...prevBookings, newBooking]);
            
            // 💡 மிக முக்கியம்: Payment பக்கத்திற்குத் தேவையான bookingId மற்றும் amount ஐ சரியாகத் திருப்புதல்
            return { 
                success: true, 
                data: newBooking,
                bookingId: newBooking._id || newBooking.id || response.data.bookingId,
                amount: newBooking.totalAmount || response.data.amount
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create booking';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Cancel a booking
    const cancelBooking = async (bookingId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            // 🛠️ /api/v1/ என்று மாற்றப்பட்டுள்ளது
            await axios.put(`${API_BASE_URL}/api/v1/bookings/${bookingId}/cancel`, {}, config);
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    (booking._id === bookingId || booking.id === bookingId) ? { ...booking, status: 'Cancelled' } : booking
                )
            );
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return (
        <BookingContext.Provider
            value={{
                bookings,
                loading,
                error,
                fetchUserBookings,
                createBooking,
                cancelBooking
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

// Custom Hook to use Booking Context
export const useBooking = () => {
    return useContext(BookingContext);
};