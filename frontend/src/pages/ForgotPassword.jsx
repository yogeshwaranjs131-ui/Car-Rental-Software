import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(response.data.message || 'Password reset link sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h3 className="m-0 text-2xl font-bold text-white mb-2">Forgot Password</h3>
                <p className="m-0 text-sm text-slate-400">
                    Enter your registered email and we'll send you a link to reset your password.
                </p>
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block mb-2 text-sm font-bold text-white">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        opacity: loading ? 0.7 : 1 // Keep dynamic opacity for loading state
                    }}
                    className="py-3 bg-blue-600 text-white border-none rounded-md text-base font-bold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                    {loading ? 'Sending Link...' : 'Send Reset Link'}
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

export default ForgotPassword;