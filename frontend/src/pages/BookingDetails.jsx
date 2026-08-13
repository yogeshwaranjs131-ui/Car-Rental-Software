import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetails = () => {
    const { id } = useParams(); // URL-ல் உள்ள புக்கிங் ஐடியை எடுப்பது (உ.கா: /booking/12345)
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(`https://car-rental-software.onrender.com/api/bookings/${id}`, config);
                setBooking(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch booking details');
            } {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookingDetails();
        }
    }, [id]);

    if (loading) {
        return <div className="text-center py-12 text-lg text-slate-400">Loading booking details...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] text-center p-5">
                <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/20 max-w-md">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-red-300 mb-6">{error}</p>
                    <button onClick={() => navigate('/bookings')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                        Back to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-slate-900 rounded-xl shadow-lg text-white my-10 border border-slate-800">
            {/* Back Button - சரியாக ரவுட்டிங் மூலம் பின் செல்லுதல் */}
            <button 
                onClick={() => navigate('/bookings')} 
                className="mb-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
            >
                &larr; Back to My Bookings
            </button>

            <h1 className="text-2xl font-bold mb-6 border-b border-slate-800 pb-3">Booking Details</h1>

            {booking && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-center bg-slate-800 p-4 rounded-lg">
                        <img 
                            src={booking.car?.image || 'https://via.placeholder.com/150'} 
                            alt={booking.car?.name || 'Car'} 
                            className="w-32 h-20 object-cover rounded-md" 
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{booking.car?.name || 'Car Rental'}</h2>
                            <p className="text-sm text-slate-400">Status: <span className="text-green-400 font-bold">{booking.status}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg">
                        <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                        <p><strong>Pickup Location:</strong> {booking.pickupLocation}</p>
                        <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;