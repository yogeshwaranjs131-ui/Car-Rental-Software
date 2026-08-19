import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const carImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1920&q=80"
];

const Login = () => {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % carImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await API.post('/auth/login', { email, password });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data || response.data.user)); 
            
            window.dispatchEvent(new Event('authChange'));
            alert('Login successful! 🎉');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex justify-center items-center overflow-hidden z-50">
            {/* Background Carousel Images */}
            {carImages.map((img, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 w-full h-full bg-cover bg-center brightness-75 transition-opacity duration-1500 -z-10 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`} 
                    style={{ backgroundImage: `url(${img})` }} 
                />
            ))}

            {/* Dark overlay for rich glass effect */}
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-md -z-10" />

            {/* Glassmorphism Login Form (Same size as Register) */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl text-white m-5">
                <div className="text-center mb-5">
                    <h2 className="m-0 text-2xl font-bold text-white mb-1">Welcome Back</h2>
                    <p className="m-0 text-sm text-slate-200">Login to manage your car rentals</p>
                </div>

                {error && <p className="text-red-300 text-sm text-center mb-4 bg-red-500/20 p-2 rounded-md border border-red-500/30">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-slate-100">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-black/30 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-slate-100">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-black/30 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-2 py-3 bg-blue-600 text-white border-none rounded-xl text-base font-bold cursor-pointer shadow-lg shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-200 m-0">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 no-underline font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;