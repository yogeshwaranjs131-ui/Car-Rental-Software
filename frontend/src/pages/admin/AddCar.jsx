import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddCar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        pricePerDay: '',
        seats: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        description: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const carData = new FormData();
        for (const key in formData) {
            carData.append(key, formData[key]);
        }
        if (image) {
            carData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/v1/cars`, carData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Car added successfully!');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add car. Please check the details.');
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (name, label, type = 'text', required = true, placeholder = '') => (
        <div>
            <label htmlFor={name} className="block mb-1.5 text-sm font-medium text-slate-300">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );

    const renderSelectField = (name, label, options) => (
        <div>
            <label htmlFor={name} className="block mb-1.5 text-sm font-medium text-slate-300">{label}</label>
            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Add New Car</h1>
            <form onSubmit={handleSubmit} className="bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-800 space-y-5">
                {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-center">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {renderInputField('name', 'Car Name')}
                    {renderInputField('brand', 'Brand')}
                    {renderInputField('category', 'Category')}
                    {renderInputField('pricePerDay', 'Price per Day (₹)', 'number')}
                    {renderInputField('seats', 'Seats', 'number')}
                    {renderSelectField('fuelType', 'Fuel Type', ['Petrol', 'Diesel', 'Electric'])}
                    {renderSelectField('transmission', 'Transmission', ['Automatic', 'Manual'])}
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1.5 text-sm font-medium text-slate-300">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter car description"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="image" className="block mb-1.5 text-sm font-medium text-slate-300">Car Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        required
                        className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/40"
                    />
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-wait">
                    {loading ? 'Adding Car...' : 'Add Car'}
                </button>
            </form>
        </div>
    );
};

export default AddCar;