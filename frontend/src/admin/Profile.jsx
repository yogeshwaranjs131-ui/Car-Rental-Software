import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch user profile data when component loads
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_BASE_URL}/api/v1/users/profile`, config);
            const userData = response.data.data || response.data;
            setUser({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(`${API_BASE_URL}/api/v1/users/profile`, user, config);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="text-center my-12 text-slate-300">Loading Profile...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-slate-800 text-slate-200 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-white">User Profile</h2>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {message && <p className="text-green-400 mb-4">{message}</p>}

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 mt-5">
                <div>
                    <label className="block text-sm font-medium text-slate-400">Full Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={user.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400">Email Address (Cannot be changed):</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={user.email} 
                        disabled 
                        className="w-full p-2.5 rounded bg-slate-600 border border-slate-500 text-slate-400 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400">Phone Number:</label>
                    <input 
                        type="text" 
                        name="phone" 
                        value={user.phone} 
                        onChange={handleChange} 
                        placeholder="Enter phone number"
                        className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400">Address:</label>
                    <textarea 
                        name="address" 
                        value={user.address} 
                        onChange={handleChange} 
                        placeholder="Enter your address"
                        rows="3"
                        className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 text-white"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full py-3 mt-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {updating ? 'Updating Profile...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;