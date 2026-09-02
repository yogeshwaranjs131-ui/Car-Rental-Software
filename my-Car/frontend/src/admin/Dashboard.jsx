import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCars: 0,
        totalBookings: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // அட்மின் அல்லது யூசர் டேஷ்போர்டு ஸ்டேட்டஸ் API-ஐ ஃபெட்ச் செய்ய
            const response = await axios.get('https://car-rental-software.onrender.com/api/dashboard/stats', config);
            setStats(response.data.data || response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Stats Cards Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Cars</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.totalCars || 30}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Bookings</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.totalBookings || 0}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{stats.totalUsers || 1}</p>
                </div>
            </div>

            {/* Quick Links Section */}
            <div style={{ marginTop: '40px' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                    <Link to="/admin/add-car" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        Add New Car
                    </Link>
                    <Link to="/admin/coupons" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        Manage Coupons
                    </Link>
                    <Link to="/cars" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        View All Cars
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;