import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login as admin to view all bookings.');
                setLoading(false);
                return;
            }

            // Backend v1 ரவுட்டுடன் இணைக்கப்பட்டுள்ளது
            const response = await axios.get(`${API_BASE_URL}/api/v1/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const resData = response.data;
            let bookingsArray = [];

            if (Array.isArray(resData)) {
                bookingsArray = resData;
            } else if (resData && Array.isArray(resData.data)) {
                bookingsArray = resData.data;
            } else if (resData && Array.isArray(resData.bookings)) {
                bookingsArray = resData.bookings;
            }

            setBookings(bookingsArray);
        } catch (err) {
            console.error("Error fetching all bookings:", err);
            setError(err.response?.data?.message || 'Failed to load bookings from server.');
        } finally {
            setLoading(false);
        }
    };

    // அட்மின் புக்கிங்கை கேன்சல் செய்யும் ஃபங்ஷன்
    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking as Admin?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/v1/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg("Booking cancelled successfully by admin!");
            setError('');
            fetchAllBookings(); // லிஸ்டை உடனுக்குடன் அப்டேட் செய்தல்
            
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            console.error("Error cancelling booking:", err);
            setError(err.response?.data?.message || 'Failed to cancel booking.');
        }
    };

    if (loading) {
        return <div className="text-white text-center py-10">Loading all bookings...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-slate-800 text-slate-200 rounded-xl shadow-lg my-8">
            <h2 className="text-2xl font-bold mb-6 text-white">📋 All Bookings Management (Admin)</h2>
            
            {error && (
                <div className="p-4 mb-4 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="p-4 mb-4 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
                    {successMsg}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-700 text-slate-300">
                            <th className="p-3">Booking ID</th>
                            <th className="p-3">Car Name</th>
                            <th className="p-3">Total Price</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(bookings) && bookings.length > 0 ? (
                            bookings.map((b) => (
                                <tr key={b._id || Math.random()} className="border-b border-slate-700 hover:bg-slate-750 transition">
                                    <td className="p-3 font-mono text-xs text-slate-300">{b._id}</td>
                                    <td className="p-3 font-medium text-white">
                                        {b.car && typeof b.car === 'object' ? (b.car.name || 'Car') : 'Car Details N/A'}
                                    </td>
                                    <td className="p-3 text-green-400 font-semibold">₹{b.totalPrice || 0}</td>
                                    <td className="p-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            b.status === 'Confirmed' ? 'bg-green-500/20 text-green-300' :
                                            b.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' : 
                                            'bg-yellow-500/20 text-yellow-300'
                                        }`}>
                                            {b.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        {b.status !== 'Cancelled' && (
                                            <button 
                                                onClick={() => handleCancelBooking(b._id)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition shadow"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400">
                                    No bookings found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBookings;