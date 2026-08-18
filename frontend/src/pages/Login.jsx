import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const backgroundCars = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1920&q=80'
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate = useNavigate();

    // ==========================================
    // Background Image Slider
    // ==========================================
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === backgroundCars.length - 1
                    ? 0
                    : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    // ==========================================
    // Email / Password Login
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/auth/login', {
                email,
                password
            });

            const data = response.data;

            console.log('FULL API RESPONSE:', data);

            if (data.success || response.status === 200) {
                alert('Login successful! 🎉');

                // Save token
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Save user
                const userData =
                    data.user ||
                    data.existingUser ||
                    data.result ||
                    data.data;

                if (userData) {
                    localStorage.setItem(
                        'user',
                        JSON.stringify(userData)
                    );
                }

                window.dispatchEvent(
                    new Event('authChange')
                );

                navigate('/');
            } else {
                alert(
                    data.message ||
                    'Invalid credentials!'
                );
            }
        } catch (error) {
            console.error(
                'Login Error:',
                error.response || error
            );

            alert(
                error.response?.data?.message ||
                'Login failed!'
            );
        }
    };

    // ==========================================
    // Google Login
    // ==========================================
    const handleGoogleLogin = () => {
        // API பேஸ் URL-ஐப் பயன்படுத்தி டைனமிக் ஆக URL-ஐ உருவாக்குதல்
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com/api';
        const googleAuthUrl = `${apiBaseUrl.replace('/api', '')}/api/auth/google`;
        window.location.href = googleAuthUrl;
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden font-sans">

            {/* ==========================================
                Background Cars
            ========================================== */}
            {backgroundCars.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex
                            ? 'opacity-100 scale-105'
                            : 'opacity-0 scale-100'
                    }`}
                    style={{
                        backgroundImage: `url(${image})`,
                        transition:
                            'opacity 1s ease-in-out, transform 6s ease-out'
                    }}
                />
            ))}

            {/* ==========================================
                Dark Overlay
            ========================================== */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />

            {/* ==========================================
                Login Card
            ========================================== */}
            <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-white">

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold tracking-wide">
                        Welcome Back
                    </h2>

                    <p className="text-sm text-gray-300 mt-1">
                        Login to manage your car rentals
                    </p>
                </div>

                {/* ==========================================
                    Google Login Button
                ========================================== */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-800 font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow-md mb-5 cursor-pointer"
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />

                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />

                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />

                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                    </svg>

                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <div className="grow border-t border-white/20" />

                    <span className="px-3 text-xs text-gray-300 uppercase tracking-wider">
                        Or with email
                    </span>

                    <div className="grow border-t border-white/20" />
                </div>

                {/* ==========================================
                    Email Login Form
                ========================================== */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Email */}
                    <div>
                        <label className="text-gray-200 text-sm block mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            placeholder="name@example.com"
                            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-200 text-sm block mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            placeholder="••••••••"
                            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition shadow-lg shadow-blue-600/40 cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                {/* Register */}
                <p className="text-gray-300 text-sm text-center mt-6">
                    Don't have an account?{' '}

                    <Link
                        to="/register"
                        className="text-blue-400 hover:underline font-medium"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;