import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [reportData, setReportData] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        activeUsers: 0,
        popularCars: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch report statistics when component loads
    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get('https://car-rental-software.onrender.com/api/reports', config);
            const data = response.data.data || response.data;
            setReportData({
                totalRevenue: data.totalRevenue || 0,
                totalBookings: data.totalBookings || 0,
                activeUsers: data.activeUsers || 0,
                popularCars: data.popularCars || []
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch report statistics.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Reports...</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <h2>Admin Reports & Analytics</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: '#e6f2ff', border: '1px solid #b3d7ff', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Revenue</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#004085' }}>₹{reportData.totalRevenue}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#e2f0d9', border: '1px solid #c3e6cb', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Bookings</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>{reportData.totalBookings}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Active Users</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>{reportData.activeUsers}</p>
                </div>
            </div>

            {/* Popular Cars Section */}
            <div style={{ marginTop: '40px' }}>
                <h3>Most Popular Cars</h3>
                {reportData.popularCars.length === 0 ? (
                    <p style={{ marginTop: '10px' }}>No popular cars data available.</p>
                ) : (
                    <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Car Name</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Brand</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Bookings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.popularCars.map((car, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{car.name}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{car.brand}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{car.bookingCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;