import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com';

const PaymentInvoice = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setError('No booking ID provided in the URL.');
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                // 🛠️ சரியான API ரூட் மூலம் புக்கிங் விவரங்களைப் பெறுதல்
                const response = await axios.get(`${API_BASE_URL}/api/v1/bookings/${bookingId}`, config);
                
                const bookingData = response.data?.data || response.data;
                setBooking(bookingData);
            } catch (err) {
                console.error('Error fetching invoice:', err);
                setError(err.response?.data?.error || 'Failed to load invoice details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-950 text-slate-300">
                <div className="text-lg font-semibold animate-pulse">Loading Tax Invoice...</div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-center p-5">
                <div className="bg-red-500/10 backdrop-blur-md p-8 rounded-2xl border border-red-500/20 max-w-md shadow-2xl">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Invoice Not Found</h2>
                    <p className="text-red-300/80 mb-6">{error || 'Could not retrieve invoice details.'}</p>
                    <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    const car = booking.car || {};
    const user = booking.user || {};
    const gstRate = booking.gstPercentage || 18;
    const baseAmount = booking.baseAmount || (booking.totalAmount ? booking.totalAmount / (1 + gstRate / 100) : 0);
    const gstAmount = booking.gstAmount || (baseAmount * gstRate) / 100;
    const totalAmount = booking.totalAmount || (baseAmount + gstAmount);

    return (
        <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 flex flex-col items-center">
            {/* Action Buttons (Hidden when printing) */}
            <div className="max-w-3xl w-full flex justify-between items-center mb-6 print:hidden">
                <Link to="/my-bookings" className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition text-sm font-semibold">
                    &larr; Back to My Bookings
                </Link>
                <button 
                    onClick={handlePrint}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                    Print / Download PDF 🖨️
                </button>
            </div>

            {/* Invoice Container */}
            <div className="max-w-3xl w-full bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-12 print:shadow-none print:p-0">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">TAX INVOICE</h1>
                        <p className="text-xs text-slate-500 mt-1">Car Rental Software Services</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">Invoice ID: <span className="font-normal text-slate-500">#{booking._id?.slice(-8).toUpperCase()}</span></p>
                        <p className="text-xs text-slate-500 mt-1">Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {booking.status || 'Confirmed'}
                        </span>
                    </div>
                </div>

                {/* Customer & Booking Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billed To</h3>
                        <p className="font-bold text-slate-800 text-base">{user.name || 'Valued Customer'}</p>
                        <p className="text-sm text-slate-600">{user.email || 'N/A'}</p>
                        <p className="text-sm text-slate-600">{user.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Trip Details</h3>
                        <p className="text-sm text-slate-700"><strong>Pickup:</strong> {booking.pickupLocation || 'N/A'}</p>
                        <p className="text-sm text-slate-700 mt-1"><strong>Dropoff:</strong> {booking.dropoffLocation || 'N/A'}</p>
                        <p className="text-sm text-slate-700 mt-1">
                            <strong>Dates:</strong> {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'} &rarr; {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Itemized Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="py-3 font-semibold">Description</th>
                                <th className="py-3 font-semibold text-center">Driver Option</th>
                                <th className="py-3 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            <tr>
                                <td className="py-4 font-medium text-slate-800">
                                    Car Rental: <span className="text-blue-600 font-bold">{car.name || car.carName || 'Rental Vehicle'}</span>
                                </td>
                                <td className="py-4 text-center text-slate-600">
                                    {booking.withDriver ? 'With Driver' : 'Self Drive'}
                                </td>
                                <td className="py-4 text-right font-semibold text-slate-800">
                                    ₹{Number(baseAmount).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals Calculation */}
                <div className="flex justify-end border-t border-slate-200 pt-5 mb-10">
                    <div className="w-full sm:w-72 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>₹{Number(baseAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>GST ({gstRate}%)</span>
                            <span>₹{Number(gstAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-3">
                            <span>Grand Total</span>
                            <span className="text-green-600">₹{Number(totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                    <p>Thank you for choosing our Car Rental Service. Have a safe journey!</p>
                    <p className="mt-1">This is a computer-generated tax invoice and does not require a physical signature.</p>
                </div>

            </div>
        </div>
    );
};

export default PaymentInvoice;