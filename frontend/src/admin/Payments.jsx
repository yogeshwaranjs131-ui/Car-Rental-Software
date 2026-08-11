import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch payment history when component loads
    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_BASE_URL}/api/v1/payments`, config);
            setPayments(response.data.data || response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payment details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center my-12 text-slate-300">Loading Payments...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-slate-800 text-slate-200 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Payment History</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}

            {payments.length === 0 ? (
                <p>No payment records found.</p>
            ) : (
                <div className="overflow-x-auto mt-5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700 text-slate-300">
                                <th className="p-3 border border-slate-600">Payment ID</th>
                                <th className="p-3 border border-slate-600">Booking ID</th>
                                <th className="p-3 border border-slate-600">Amount</th>
                                <th className="p-3 border border-slate-600">Status</th>
                                <th className="p-3 border border-slate-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id} className="border-b border-slate-700">
                                    <td className="p-3 border border-slate-600 font-mono text-xs">{payment._id}</td>
                                    <td className="p-3 border border-slate-600 font-mono text-xs">{payment.bookingId || 'N/A'}</td>
                                    <td className="p-3 border border-slate-600">₹{payment.amount}</td>
                                    <td className={`p-3 border border-slate-600 font-bold ${payment.status === 'Success' ? 'text-green-400' : 'text-orange-400'}`}>
                                        {payment.status || 'Pending'}
                                    </td>
                                    <td className="p-3 border border-slate-600">
                                        {new Date(payment.createdAt).toLocaleDateString()}
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

export default Payments;