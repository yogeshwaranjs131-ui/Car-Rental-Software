import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api'; // உனது ஆக்சியோஸ் API செட்டப்

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/api/auth/login', { email, password });
            const data = response.data;
            
            if (data.success || response.status === 200) {
                alert("Login Successful! Welcome 🎉");
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data || data.user)); 
                
                // Navbar-ஐ உடனே மாற்ற சிக்னல் அனுப்புவது
                window.dispatchEvent(new Event('authChange'));
                
                window.location.href = '/'; 
            } else {
                alert(data.message || "Invalid Credentials!");
            }
        } catch (error) {
            console.error("Login Error:", error.response || error);
            alert(error.response?.data?.message || "Login Failed!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Login to Car Rental</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-slate-300 text-sm block mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-slate-300 text-sm block mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition">
                        Login
                    </button>
                </form>
                <p className="text-slate-400 text-sm text-center mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;