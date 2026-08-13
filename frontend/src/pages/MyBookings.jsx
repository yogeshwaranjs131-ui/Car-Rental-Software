import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/common/Modal'; // மோடல் காம்போனென்டை இறக்குமதி செய்யவும்

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: { populate: 'car' } // கார் விவரங்களையும் சேர்த்து அனுப்புமாறு கேட்கவும்
                };
                const response = await axios.get('https://car-rental-software.onrender.com/api/bookings', config);             
                
                // பேக்கெண்ட் அனுப்பும் டேட்டா எப்படி இருந்தாலும் பாதுகாப்பாக Array-வாக மாற்றுகிறோம்
                const rawData = response.data;
                const bookingsData = Array.isArray(rawData) 
                    ? rawData 
                    : (Array.isArray(rawData?.data) ? rawData.data : []);
                
                setBookings(bookingsData);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch your bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, []);

    const openCancelModal = (bookingId) => {
        setBookingToCancel(bookingId);
        setIsModalOpen(true);
    };

    const handleCancelBooking = async (bookingId) => {
        if (!bookingId) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`https://car-rental-software.onrender.com/api/bookings/${bookingId}/cancel`, {}, config);
            
            // UI-ஐ உடனே அப்டேட் செய்தல்
            setBookings((prevBookings) =>
                Array.isArray(prevBookings) 
                    ? prevBookings.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
                    : []
            );
            setIsModalOpen(false);
            setBookingToCancel(null);
            alert('Booking cancelled successfully.');
        } catch (err) { // <--- இங்கே 'else (err)' என்பதற்கு பதிலாக 'catch (err)' என மாற்றப்பட்டுள்ளது
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-lg text-slate-400">Loading your bookings...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] text-center p-5">
                <div className="bg-red-500/10 backdrop-blur-md p-8 rounded-2xl border border-red-500/20 max-w-md shadow-2xl">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Bookings</h2>
                    <p className="text-red-300/80 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Confirm Cancellation"
            >
                <div>
                    <p className="text-slate-600">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">
                            Keep Booking
                        </button>
                        <button onClick={() => handleCancelBooking(bookingToCancel)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Confirm Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            <h1 className="text-3xl font-bold mb-8 text-white">My Bookings</h1>

            {!Array.isArray(bookings) || bookings.length === 0 ? (
                <div className="text-center py-16 px-6 bg-slate-900 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 mb-5">You have no active or past bookings.</p>
                    <Link to="/cars" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Browse Cars
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {bookings.map((booking) => {
                        if (!booking) return null;

                        return (
                            <div key={booking._id || Math.random()} className={`bg-slate-900 rounded-xl p-5 shadow-lg flex flex-wrap justify-between items-center gap-5 border-l-4 ${booking.status === 'Cancelled' ? 'border-red-500' : 'border-green-500'}`}>
                                <div className="flex gap-5 items-center">
                                    <div className="w-28 h-20 bg-slate-800 rounded-lg overflow-hidden">
                                        <img src={booking.car?.image || 'https://via.placeholder.com/150?text=Car'} alt={booking.car?.name || 'Car'} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{booking.car?.name || 'Car Rental'}</h3>
                                        <p className="text-sm text-slate-400">
                                            <strong>From:</strong> {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'} &bull; <strong>To:</strong> {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Pickup: {booking.pickupLocation || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {booking.status || 'Confirmed'}
                                    </span>

                                    <div className="flex gap-2">
                                        {booking.status !== 'Cancelled' && (
                                            <button onClick={() => openCancelModal(booking._id)} className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;