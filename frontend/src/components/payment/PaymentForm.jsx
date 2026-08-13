import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ bookingId, amount, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const paymentData = {
                bookingId,
                amount,
                paymentMethod,
                status: 'Completed'
            };

            const response = await axios.post('https://car-rental-software.onrender.com/api/payments', paymentData, config);

            if (response.data) {
                alert('Payment successful!');
                if (onSuccess) onSuccess(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', textAlign: 'center' }}>Complete Payment</h3>
            
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Total Amount: </span>
                <strong style={{ fontSize: '18px', color: '#007bff' }}>₹{amount}</strong>
            </div>

            {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                        Select Payment Method
                    </label>
                    <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }}
                    >
                        <option value="card">Credit / Debit Card</option>
                        <option value="upi">UPI / Net Banking</option>
                        <option value="cash">Cash on Delivery</option>
                    </select>
                </div>

                {paymentMethod === 'card' && (
                    <>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Card Number</label>
                            <input 
                                type="text" 
                                placeholder="4111 2222 3333 4444" 
                                required 
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>Expiry Date</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    required 
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>CVV</label>
                                <input 
                                    type="password" 
                                    placeholder="123" 
                                    maxLength="3" 
                                    required 
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {paymentMethod === 'upi' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>UPI ID</label>
                        <input 
                            type="text" 
                            placeholder="username@oksbi" 
                            required 
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: '12px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        marginTop: '10px'
                    }}
                >
                    {loading ? 'Processing...' : `Pay ₹${amount}`}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;