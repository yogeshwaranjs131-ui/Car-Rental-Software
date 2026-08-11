import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all bookings when component loads
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_BASE_URL}/api/v1/bookings`, config);
            setBookings(response.data.data || response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    };

    // Handle booking status update (Confirm/Cancel)
    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.patch(`${API_BASE_URL}/api/v1/bookings/${id}/status`, { status }, config);
            
            alert(`Booking status updated to ${status}`);
            fetchBookings(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        }
    };

    // Handle delete booking
    const handleDeleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.delete(`${API_BASE_URL}/api/v1/bookings/${id}`, config);
            
            alert('Booking deleted successfully');
            setBookings(bookings.filter((booking) => booking._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete booking.');
        }
    };

    if (loading) {
        return <div className="text-center my-12">Loading Bookings...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto my-8 p-6 bg-slate-800 text-slate-200 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Manage Customer Bookings</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}

            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="overflow-x-auto mt-5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700 text-slate-300">
                                <th className="p-3 border border-slate-600">Booking ID</th>
                                <th className="p-3 border border-slate-600">Car</th>
                                <th className="p-3 border border-slate-600">Total Price</th>
                                <th className="p-3 border border-slate-600">Status</th>
                                <th className="p-3 border border-slate-600">User</th>
                                <th className="p-3 border border-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-b border-slate-700">
                                    <td className="p-3 border border-slate-600 font-mono text-xs">{booking._id}</td>
                                    <td className="p-3 border border-slate-600">{booking.car?.name || 'Car Details'}</td>
                                    <td className="p-3 border border-slate-600">₹{booking.totalPrice}</td>
                                    <td className={`p-3 border border-slate-600 font-bold ${booking.status === 'Confirmed' ? 'text-green-400' : 'text-orange-400'}`}>
                                        {booking.status || 'Pending'}
                                    </td>
                                    <td className="p-3 border border-slate-600">{booking.user?.name || 'N/A'}</td>
                                    <td className="p-3 border border-slate-600 flex gap-2">
                                        <Link
                                            to={`/cars/${booking.car?._id}`}
                                            className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            View Car
                                        </Link>
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                            className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Confirm
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteBooking(booking._id)}
                                            className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;