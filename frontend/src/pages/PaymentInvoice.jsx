import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com';
const logoImageUrl = 'https://res.cloudinary.com/dfbkat3cb/image/upload/w_150,h_150,c_fill,r_max/v1786468571/logo_i6gox8.jpg';

const PaymentInvoice = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setError('Booking ID not found in URL.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/bookings/${bookingId}`);
                if (response.data && response.data.success) {
                    setBooking(response.data.data);
                } else {
                    setError('Failed to load booking details.');
                }
            } catch (err) {
                console.error('Error fetching booking:', err);
                setError('Something went wrong while fetching invoice details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
                <h2>Loading Tax Invoice...</h2>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif', color: '#ef4444' }}>
                <h2>{error || 'Booking not found'}</h2>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', padding: '30px 15px', minHeight: '100vh' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                
                {/* Invoice Header */}
                <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '30px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 15px auto', background: '#ffffff', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                        <img src={logoImageUrl} alt="Company Logo" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                    <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>Tax Invoice</h1>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#e2e8f0' }}>Car Rental Services Official Receipt</p>
                </div>

                {/* Invoice Body */}
                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                        <div>
                            <p style={{ margin: '0 0 5px', color: '#64748b', fontSize: '13px' }}>Billed To:</p>
                            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{booking.user?.name || 'Customer'}</p>
                            <p style={{ margin: '3px 0 0', fontSize: '14px', color: '#475569' }}>{booking.user?.email}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 5px', color: '#64748b', fontSize: '13px' }}>Booking ID:</p>
                            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px', color: '#1e293b', wordBreak: 'break-all' }}>{booking._id}</p>
                            <p style={{ margin: '8px 0 5px', color: '#64748b', fontSize: '13px' }}>Date:</p>
                            <p style={{ margin: '0', fontSize: '14px', color: '#475569' }}>{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div style={{ backgroundColor: '#f1f5f9', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px' }}>
                        <h3 style={{ margin: '0 0 10px', fontSize: '15px', color: '#334155' }}>Trip Summary</h3>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#475569' }}><strong>Car:</strong> {booking.car?.name || booking.car?.carName || 'Selected Car'}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#475569' }}><strong>Pickup:</strong> {booking.pickupLocation}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#475569' }}><strong>Dropoff:</strong> {booking.dropoffLocation}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#475569' }}><strong>Duration:</strong> {booking.startDate?.split('T')[0]} to {booking.endDate?.split('T')[0]}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#475569' }}><strong>Driver Option:</strong> {booking.withDriver ? 'With Chauffeur (+₹500/day)' : 'Self Drive'}</p>
                    </div>

                    {/* GST Breakdown Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e2e8f0', textAlign: 'left', color: '#334155', fontSize: '14px' }}>
                                <th style={{ padding: '10px 12px', border: '1px solid #cbd5e1' }}>Description</th>
                                <th style={{ padding: '10px 12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '14px', color: '#1e293b' }}>
                            <tr>
                                <td style={{ padding: '10px 12px', border: '1px solid #cbd5e1' }}>Base Rental Amount</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(booking.baseAmount)}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px 12px', border: '1px solid #cbd5e1' }}>GST ({booking.gstPercentage || 18}%)</td>
                                <td style={{ padding: '10px 12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{formatCurrency(booking.gstAmount)}</td>
                            </tr>
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>Grand Total</td>
                                <td style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#16a34a', fontSize: '16px' }}>{formatCurrency(booking.totalAmount)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Print Button */}
                    <div style={{ textAlign: 'center' }}>
                        <button 
                            onClick={() => window.print()} 
                            style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px 25px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}
                        >
                            Print / Download Invoice
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ backgroundColor: '#f1f5f9', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    &copy; {new Date().getFullYear()} Car Rental Services. All rights reserved.
                </div>

            </div>
        </div>
    );
};

export default PaymentInvoice;