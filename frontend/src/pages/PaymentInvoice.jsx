import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';

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
                const response = await API.get(`/bookings/${bookingId}`);
                const bookingData = response.data?.data || response.data;
                setBooking(bookingData);
            } catch (err) {
                console.error('Error fetching invoice:', err);
                setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load invoice details.');
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
            <div className="flex justify-center items-center min-h-screen bg-slate-950 text-amber-300">
                <div className="text-lg font-semibold animate-pulse">Loading Luxury Invoice...</div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-center p-5">
                <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-amber-500/40 max-w-md shadow-2xl">
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">Invoice Not Found</h2>
                    <p className="text-slate-300/80 mb-6">{error || 'Could not retrieve invoice details.'}</p>
                    <Link to="/" className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-amber-500/25">
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    const car = booking.car || {};
    const user = booking.user || {};
    const gstRate = booking.gstPercentage || 18;
    
    // Calculations
    const insuranceAmount = booking.insuranceAmount || booking.insurance || 0;
    const baseAmount = booking.baseAmount || (booking.totalAmount ? (booking.totalAmount - insuranceAmount) / (1 + gstRate / 100) : 0);
    const gstAmount = booking.gstAmount || (baseAmount * gstRate) / 100;
    const totalAmount = booking.totalAmount || (baseAmount + gstAmount + insuranceAmount);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-zinc-900 to-stone-950 py-10 px-4 sm:px-6 flex flex-col items-center">
            {/* Action Buttons (Hidden when printing) */}
            <div className="max-w-4xl w-full flex justify-between items-center mb-6 print:hidden">
                <Link to="/my-bookings" className="px-4 py-2 bg-slate-900/80 text-amber-300 rounded-xl hover:bg-slate-800 transition text-sm font-semibold border border-amber-500/20 backdrop-blur-md">
                    &larr; Back to My Bookings
                </Link>
                <button 
                    onClick={handlePrint}
                    className="px-5 py-2 bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-700 text-slate-950 rounded-xl transition text-sm font-extrabold shadow-lg shadow-amber-500/30 flex items-center gap-2"
                >
                    Print / Download A4 PDF 🖨️
                </button>
            </div>

            {/* Luxury Gradient Invoice Container (100% Gold/Dark Theme Match) */}
            <div className="max-w-4xl w-full bg-linear-to-b from-zinc-900/95 via-slate-900/95 to-zinc-950/95 backdrop-blur-2xl text-slate-100 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-14 border-2 border-amber-500/40 print:shadow-none print:p-6 print:bg-white print:text-slate-800 relative">
                
                {/* Gold/Bronze Top Glowing Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-amber-300 via-yellow-500 to-amber-600 print:hidden"></div>

                {/* Header with Cloudinary Logo */}
                <div className="flex justify-between items-center border-b border-amber-500/20 pb-8 mb-8 print:border-slate-200">
                    <div className="flex items-center gap-4">
                        <img 
                            src="https://res.cloudinary.com/dfbkat3cb/image/upload/v1786468571/logo_i6gox8.jpg" 
                            alt="Car Rental Logo" 
                            className="h-16 w-auto object-contain bg-slate-900/90 p-2 rounded-2xl border border-amber-500/40 shadow-inner print:bg-white" 
                        />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
                                TAX INVOICE
                            </h1>
                            <p className="text-xs sm:text-sm text-amber-200/70 font-medium">Car Rental Software Services</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-300 print:text-slate-700">Invoice ID: <span className="font-normal text-amber-400 print:text-amber-600">#{booking._id?.slice(-8).toUpperCase()}</span></p>
                        <p className="text-xs text-slate-400 mt-1">Date: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                            {booking.status || 'Paid / Confirmed'}
                        </span>
                    </div>
                </div>

                {/* Customer & Booking Info Cards with Gold accents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-zinc-950/60 p-6 rounded-2xl border border-amber-500/20 print:bg-slate-50 print:border-slate-100">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Billed To</h3>
                        <p className="font-bold text-white text-base print:text-slate-800">{user.name || 'Valued Customer'}</p>
                        <p className="text-sm text-slate-300 print:text-slate-600">{user.email || 'N/A'}</p>
                        <p className="text-sm text-slate-300 print:text-slate-600">{user.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Trip Details</h3>
                        <p className="text-sm text-slate-300 print:text-slate-700"><strong>Pickup:</strong> {booking.pickupLocation || 'N/A'}</p>
                        <p className="text-sm text-slate-300 print:text-slate-700 mt-1"><strong>Dropoff:</strong> {booking.dropoffLocation || 'N/A'}</p>
                        <p className="text-sm text-slate-300 print:text-slate-700 mt-1">
                            <strong>Dates:</strong> {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'} &rarr; {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Itemized Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-amber-500/20 text-amber-300/80 text-xs uppercase tracking-wider print:border-slate-200">
                                <th className="py-3 font-semibold">Description</th>
                                <th className="py-3 font-semibold text-center">Option</th>
                                <th className="py-3 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-sm print:divide-slate-100">
                            {/* Car Rental Row */}
                            <tr>
                                <td className="py-4 flex items-center gap-4">
                                    <img 
                                        src={car.image || car.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80'} 
                                        alt={car.name || 'Rental Car'} 
                                        className="w-24 h-16 object-cover rounded-xl border border-amber-500/30 shadow-md"
                                    />
                                    <div>
                                        <p className="font-bold text-white text-base print:text-slate-800">{car.name || car.carName || 'Rental Vehicle'}</p>
                                        <p className="text-xs text-amber-400 font-medium">Rental Charge</p>
                                    </div>
                                </td>
                                <td className="py-4 text-center text-slate-300 print:text-slate-600 font-medium">
                                    {booking.withDriver ? 'With Driver' : 'Self Drive'}
                                </td>
                                <td className="py-4 text-right font-semibold text-white print:text-slate-800 text-base">
                                    ₹{Number(baseAmount).toFixed(2)}
                                </td>
                            </tr>

                            {/* Insurance Row */}
                            {insuranceAmount > 0 && (
                                <tr>
                                    <td className="py-4 font-medium text-white print:text-slate-800" colSpan="2">
                                        Vehicle Insurance & Protection Cover
                                    </td>
                                    <td className="py-4 text-right font-semibold text-white print:text-slate-800 text-base">
                                        ₹{Number(insuranceAmount).toFixed(2)}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Totals Calculation */}
                <div className="flex justify-end border-t border-amber-500/20 pt-5 mb-10 print:border-slate-200">
                    <div className="w-full sm:w-80 space-y-3 text-sm">
                        <div className="flex justify-between text-slate-400 print:text-slate-600">
                            <span>Subtotal</span>
                            <span>₹{Number(baseAmount + insuranceAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400 print:text-slate-600">
                            <span>GST ({gstRate}%)</span>
                            <span>₹{Number(gstAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white border-t border-amber-500/30 pt-3 print:border-slate-200 print:text-slate-900">
                            <span>Grand Total</span>
                            <span className="text-amber-400 print:text-amber-600 text-xl font-black">₹{Number(totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-amber-500/20 pt-6 text-center text-xs text-slate-400 print:border-slate-100">
                    <p className="text-amber-200/80">Thank you for choosing our Car Rental Service. Have a safe journey!</p>
                    <p className="mt-1">This is a computer-generated tax invoice and does not require a physical signature.</p>
                </div>

            </div>
        </div>
    );
};

export default PaymentInvoice;