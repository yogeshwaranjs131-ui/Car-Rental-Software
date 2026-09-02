import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; // Centralized Axios instance
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaSignOutAlt, FaEdit, FaLock, FaCamera } from 'react-icons/fa';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const getImageUrl = (imagePath) => {
        const placeholder = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
        if (!imagePath) return placeholder;
        if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
        const baseURL = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com';
        return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // Since baseURL already contains /api/v1, use /users/profile only
                const response = await API.get('/users/profile');
                
                const userData = response.data?.data || response.data;
                if (userData) {
                    setUser(userData);
                    setFormData({ 
                        name: userData.name || '', 
                        email: userData.email || '', 
                        phone: userData.phone || '' 
                    });
                    setImagePreview(getImageUrl(userData.profilePicture || userData.image));
                }
            } catch (err) {
                setError('Failed to fetch profile. Please try again.');
                console.error("Fetch Profile Error:", err);
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const uploadData = new FormData();
            uploadData.append('name', formData.name);
            uploadData.append('email', formData.email);
            uploadData.append('phone', formData.phone);
            
            if (profileImageFile) {
                // Must match upload.single('profilePicture') on the backend
                uploadData.append('profilePicture', profileImageFile);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            
            const response = await API.put('/users/profile', uploadData, config);
            
            const updatedUser = response.data?.data || response.data;
            setUser(updatedUser);
            setImagePreview(getImageUrl(updatedUser.profilePicture || updatedUser.image));
            
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                const newStoredUser = { ...storedUser, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(newStoredUser));
            }
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (user) {
            setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
            setImagePreview(getImageUrl(user.profilePicture || user.image));
            setProfileImageFile(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-slate-400 text-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                Loading profile... 🚗
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
                <div className="h-40 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                <div className="px-6 sm:px-10 pb-10 relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-8 gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div className="relative group">
                                <img 
                                    src={imagePreview} 
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl bg-slate-800"
                                />
                                {isEditing && (
                                    <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300">
                                        <FaCamera className="text-white text-2xl" />
                                        <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>
                            <div className="mt-2 sm:mt-0">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">{user?.name}</h1>
                                <p className="text-sm text-slate-400">{user?.email}</p>
                            </div>
                        </div>

                        <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">
                            {user?.role || 'Customer'}
                        </span>
                    </div>

                    {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm font-medium">{error}</div>}
                    {message && <div className="p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-sm font-medium">{message}</div>}

                    {!isEditing ? (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-4 bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg shrink-0">
                                        <FaUser />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Full Name</p>
                                        <p className="text-base font-bold text-white truncate">{user?.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-lg shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email Address</p>
                                        <p className="text-base font-bold text-white truncate">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-lg shrink-0">
                                        <FaPhone />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Phone Number</p>
                                        <p className="text-base font-bold text-white truncate">{user?.phone || 'Not Provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-lg shrink-0">
                                        <FaShieldAlt />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Status</p>
                                        <p className="text-base font-bold text-emerald-400 truncate">Active & Verified</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
                                    >
                                        <FaEdit />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button 
                                        onClick={() => navigate('/change-password')}
                                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 px-6 py-3 rounded-xl font-semibold transition border border-amber-500/20"
                                    >
                                        <FaLock />
                                        <span>Change Password</span>
                                    </button>
                                </div>

                                <button 
                                    onClick={handleLogout}
                                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-6 py-3 rounded-xl font-semibold transition border border-red-500/20"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancelEdit}
                                    className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition border border-slate-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;