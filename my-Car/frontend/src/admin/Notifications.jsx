import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch notifications when component loads
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get('https://car-rental-software.onrender.com/api/notifications', config);
            setNotifications(response.data.data || response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch notifications.');
        } finally {
            setLoading(false);
        }
    };

    // Handle mark as read
    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(`https://car-rental-software.onrender.com/api/notifications/${id}/read`, {}, config);
            
            // Update state locally
            setNotifications(
                notifications.map((notif) => 
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
        } catch (err) {
            alert('Failed to update notification status.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Notifications...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px' }}>
            <h2>Notifications</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {notifications.length === 0 ? (
                <p>No new notifications.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {notifications.map((notif) => (
                        <div 
                            key={notif._id} 
                            style={{ 
                                padding: '15px', 
                                border: '1px solid #ddd', 
                                borderRadius: '6px', 
                                backgroundColor: notif.isRead ? '#f9f9f9' : '#e6f2ff',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <p style={{ margin: '0 0 5px 0', fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                                    {notif.message}
                                </p>
                                <small style={{ color: '#666' }}>
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                </small>
                            </div>

                            {!notif.isRead && (
                                <button 
                                    onClick={() => handleMarkAsRead(notif._id)}
                                    style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notification;