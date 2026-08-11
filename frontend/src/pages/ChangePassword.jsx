import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.put(
                'http://localhost:5000/api/users/change-password',
                { oldPassword, newPassword },
                config
            );
            setMessage(response.data.message || 'Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            // Optionally, log out the user or redirect to profile
            // navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-xl shadow-lg border border-slate-800 text-white my-8">
            <h2 className="m-0 text-2xl font-bold text-white text-center mb-6">Change Password</h2>

            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            {message && <p className="text-green-500 text-center text-sm mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block mb-2 font-bold text-sm text-white">
                        Old Password
                    </label>
                    <input 
                        type="password" 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-bold text-sm text-white">
                        New Password
                    </label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-bold text-sm text-white">
                        Confirm New Password
                    </label>
                    <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="py-3 bg-blue-600 text-white border-none rounded-md text-base font-bold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;