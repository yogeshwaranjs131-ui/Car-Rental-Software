import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div style={{ 
            maxWidth: '500px', 
            margin: '60px auto', 
            padding: '40px 20px', 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
            textAlign: 'center' 
        }}>
            {/* Success Icon */}
            <div style={{ 
                width: '70px', 
                height: '70px', 
                backgroundColor: '#28a745', 
                color: '#fff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '35px', 
                margin: '0 auto 20px auto',
                fontWeight: 'bold'
            }}>
                &#10003;
            </div>

            <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '24px' }}>Payment Successful!</h2>
            
            <p style={{ margin: '0 0 25px 0', color: '#666', fontSize: '15px', lineHeight: '1.5' }}>
                Thank you for your payment. Your car booking has been confirmed successfully. You can check your booking and payment history in your profile.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <Link 
                    to="/profile" 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    View Bookings
                </Link>
                
                <Link 
                    to="/cars" 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#6c757d', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    Back to Gallery
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;