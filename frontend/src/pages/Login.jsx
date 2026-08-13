import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
    const carImages = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop&q=80'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [carImages.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/api/v1/auth/login', { email, password });
            const data = response.data;
            
            if (data.success || response.status === 200) {
                alert("Login Successful! Welcome to Car Rental Dashboard 🎉");
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data || data.user)); 
                navigate('/');
            } else {
                alert(data.message || "Invalid Credentials! Please check your email or password.");
            }
        } catch (error) {
            console.error("Login Error:", error.response || error);
            const errorMessage = error.response?.data?.message || "Invalid Credentials! Please check your email or password.";
            alert(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-slate-950 overflow-hidden m-0 p-0 box-border z-50">
            {/* Background Carousel Images */}
            {carImages.map((img, index) => (
                <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 z-10 pointer-events-none ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={img} alt={`Car Slide ${index}`} className="w-full h-full object-cover object-center block" />
                </div>
            ))}

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/80 to-slate-900/65 z-20 pointer-events-none"></div>

            {/* Glassmorphism Login Form Card */}
            <div className="relative z-30 bg-slate-900/75 backdrop-blur-xl p-8 rounded-2xl border border-white/15 w-full max-w-md shadow-2xl text-white">
                <h2 className="text-white text-3xl font-extrabold mb-2 text-center">Welcome Back</h2>
                <p className="text-slate-400 text-sm text-center mb-6">Enter your credentials to access your account</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-base outline-none box-border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-base outline-none box-border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white border-none px-4 py-3 rounded-lg text-base font-bold cursor-pointer transition-colors mt-3 shadow-lg shadow-blue-600/40 hover:bg-blue-700">
                        Sign In
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                    Don't have an account? <Link to="/register" className="text-blue-500 no-underline font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;