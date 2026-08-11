import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCar = () => {
    const { id } = useParams(); // URL-ல் இருந்து காரின் ID-ஐ எடுப்பது
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Hatchback',
        pricePerDay: '',
        seats: '',
        fuelType: 'petrol',
        image: ''
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    // குறிப்பிட்ட காரின் பழைய டேட்டாவை ஃபெட்ச் செய்து ஃபார்மில் நிரப்புவது
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
                const carData = response.data.data || response.data;
                setFormData({
                    name: carData.name || '',
                    brand: carData.brand || '',
                    category: carData.category || 'Hatchback',
                    pricePerDay: carData.pricePerDay || '',
                    seats: carData.seats || '',
                    fuelType: carData.fuelType || 'petrol',
                    image: carData.image || ''
                });
            } catch (err) {
                setError('Failed to load car details for editing.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(`http://localhost:5000/api/cars/${id}`, formData, config);
            
            alert('Car Updated Successfully!');
            navigate('/admin/dashboard'); // அப்டேட் ஆனதும் டேஷ்போர்டுக்குச் செல்ல
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update car.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Car Details...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Edit Car Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Car Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Brand:</label>
                    <input 
                        type="text" 
                        name="brand" 
                        value={formData.brand} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Category:</label>
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                </div>

                <div>
                    <label>Price Per Day (₹):</label>
                    <input 
                        type="number" 
                        name="pricePerDay" 
                        value={formData.pricePerDay} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Seats:</label>
                    <input 
                        type="number" 
                        name="seats" 
                        value={formData.seats} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Fuel Type:</label>
                    <select 
                        name="fuelType" 
                        value={formData.fuelType} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                    </select>
                </div>

                <div>
                    <label>Image URL:</label>
                    <input 
                        type="text" 
                        name="image" 
                        value={formData.image} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={updating}
                    style={{ padding: '10px', backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {updating ? 'Updating Car...' : 'Update Car'}
                </button>
            </form>
        </div>
    );
};

export default EditCar;