import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Coupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // கூப்பன்களை டேட்டாபேஸில் இருந்து ஃபெட்ச் செய்ய (Fetch Coupons)
    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axios.get('https://car-rental-software.onrender.com/api/coupons', config);
            setCoupons(response.data.data || response.data);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        }
    };

    // கூப்பனை அப்ளை செய்து டிஸ்கவுண்ட் பெறுவது (Apply Coupon)
    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.post(
                'https://car-rental-software.onrender.com/api/coupons/apply', 
                { code: couponCode }, 
                config
            );

            setDiscount(response.data.discount);
            setMessage(`Coupon applied successfully! You got ${response.data.discount}% off.`);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Invalid or expired coupon code.');
            setDiscount(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Apply Promo / Coupon Code</h2>
            
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Enter Coupon Code (e.g., SAVE20)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    required
                    style={{ flex: 1, padding: '8px', textTransform: 'uppercase' }}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Applying...' : 'Apply'}
                </button>
            </form>

            {message && (
                <p style={{ color: discount > 0 ? 'green' : 'red', marginTop: '10px' }}>
                    {message}
                </p>
            )}

            {discount > 0 && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e2f0d9', borderRadius: '4px' }}>
                    <strong>Discount Applied: {discount}%</strong>
                </div>
            )}
        </div>
    );
};

export default Coupon;