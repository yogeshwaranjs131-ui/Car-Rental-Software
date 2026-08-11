import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all cars when component loads
    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cars');
            setCars(response.data.data || response.data);
        } catch (err) {
            setError('Failed to fetch cars.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete car
    const handleDeleteCar = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.delete(`http://localhost:5000/api/cars/${id}`, config);
            
            alert('Car deleted successfully');
            setCars(cars.filter((car) => car._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete car.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Cars...</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Cars</h2>
                <Link to="/admin/add-car" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                    Add New Car
                </Link>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {cars.length === 0 ? (
                <p>No cars found.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Image</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Brand</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price/Day</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <img src={car.image} alt={car.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{car.name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{car.brand}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{car.pricePerDay}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', display: 'flex', gap: '5px' }}>
                                        <Link 
                                            to={`/admin/edit-car/${car._id}`}
                                            style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '3px', fontWeight: 'bold' }}
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteCar(car._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
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

export default ManageCars;