import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.message || 'Password reset successful! Redirecting to login...');
            
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h3 className="m-0 text-2xl font-bold text-white mb-2">Reset Password</h3>
                <p className="m-0 text-sm text-slate-400">
                    Please enter your new password below.
                </p>
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block mb-2 text-sm font-bold text-white">
                        New Password
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                        className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-bold text-white">
                        Confirm New Password
                    </label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="py-3 bg-blue-600 text-white border-none rounded-md text-base font-bold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
            </form>

            <div className="text-center mt-5">
                <Link to="/auth/login" className="text-sm text-blue-500 no-underline hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;