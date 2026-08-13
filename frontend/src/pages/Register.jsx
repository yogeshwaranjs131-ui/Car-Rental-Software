import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const carImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1920&q=80"
];

const Register = () => {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % carImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await API.post('/api/auth/register', formData);
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data || response.data.user)); 
            alert('Registration successful!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex justify-center items-center overflow-hidden z-50">
            {/* Background Carousel Images with Clear Visibility */}
            {carImages.map((img, index) => (
                <div key={index} className={`absolute inset-0 w-full h-full bg-cover bg-center brightness-65 transition-opacity duration-1500 -z-10 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})` }} />
            ))}

            {/* Highly Transparent Glassmorphism Register Form */}
            <div className="w-full max-w-md bg-slate-900/45 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/25 text-white m-5">
                <div className="text-center mb-5">
                    <h2 className="m-0 text-2xl font-bold text-white mb-1">Corporate Register</h2>
                    <p className="m-0 text-sm text-slate-200">Streamline your executive fleet access</p>
                </div>

                {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-500/20 p-2 rounded-md">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block mb-1 text-xs font-semibold text-slate-100">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 rounded-md border border-white/30 bg-slate-900/60 text-white text-sm box-border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-slate-100">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="corporate@company.com"
                            className="w-full px-3 py-2 rounded-md border border-white/30 bg-slate-900/60 text-white text-sm box-border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-slate-100">Phone Number</label>
                        <input 
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full px-3 py-2 rounded-md border border-white/30 bg-slate-900/60 text-white text-sm box-border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold text-slate-100">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-md border border-white/30 bg-slate-900/60 text-white text-sm box-border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-2 py-3 bg-blue-600 text-white border-none rounded-md text-base font-bold cursor-pointer shadow-lg shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-200 m-0">
                        Already have a corporate account?{' '}
                        <Link to="/login" className="text-blue-400 no-underline font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;