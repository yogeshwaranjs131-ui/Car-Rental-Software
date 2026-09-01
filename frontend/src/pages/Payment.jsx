import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId, totalAmount } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const carImages = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop&q=80'
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [carImages.length]);

    // Razorpay script load
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const displayRazorpay = async () => {
        if (!bookingId || !totalAmount) {
            setError('Booking details are missing. Please try again.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            // Backend API Call to create order
            const { data } = await axios.post(
                'https://car-rental-software.onrender.com/api/v1/payments/create-order',
                { bookingId, amount: totalAmount },
                config
            );

            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const options = {
                key: data.key_id || 'rzp_test_TMcM4auCvY54MD',
                amount: data.amount,
                currency: 'INR',
                name: 'Tamil Nadu Car Rental',
                description: `Booking ID: ${bookingId}`,
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const verificationResponse = await axios.post(
                            'https://car-rental-software.onrender.com/api/v1/payments/verify-payment', 
                            response, 
                            config
                        );
                        if (verificationResponse.data.success) {
                            alert('Payment Successful! Your booking is confirmed.');
                            toast.success('Payment Successful! Your booking is confirmed.');
                            navigate('/my-bookings');
                        } else {
                            setError('Payment verification failed. Please contact support.');
                        }
                    } catch (verifyErr) {
                        setError('Payment verification error occurred.');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                theme: { color: '#2563eb' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
            setError(backendMessage || 'Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!bookingId) {
        return ( // Error state when booking details are missing
            <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-slate-950 z-50 text-slate-50">
                <div className="bg-red-500/20 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center max-w-md">
                    <h2 className="text-red-400 text-2xl font-bold mb-4">Error: Booking Details Missing</h2>
                    <p className="text-red-300 mb-6 text-base">No booking information found. Please start the booking process again.</p>
                    <button onClick={() => navigate('/cars')} className="px-6 py-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-bold hover:bg-blue-700 transition-colors">Back to Car Gallery</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-slate-950 z-50">
            {carImages.map((img, index) => (
                <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 z-10 pointer-events-none bg-cover bg-center ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})` }} />
            ))}

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/80 to-slate-900/65 z-20 pointer-events-none"></div>

            <div className="relative z-30 bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-lg shadow-2xl text-slate-50">
                <div className="text-center mb-6">
                    <h2 className="m-0 text-2xl font-bold mb-1">Secure Payment Gateway</h2>
                    <p className="m-0 text-sm text-slate-400">
                        Total Payable Amount: <strong className="text-lg text-blue-400">₹{totalAmount}</strong>
                    </p>
                </div>

                {error && <p className="text-red-300 text-center mb-4 text-sm">{error}</p>}

                <button
                    onClick={displayRazorpay}
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-blue-600 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/40 hover:bg-blue-700"
                >
                    {loading ? 'Initializing Payment...' : `Pay ₹${totalAmount}`}
                </button>

                <div className="text-center mt-5">
                    <Link to={`/booking/${bookingId}`} className="text-slate-400 no-underline text-xs hover:underline">
                        ← Go back to booking
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Payment;