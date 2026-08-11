import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:5000/api/wishlist', config);
                
                // Backend-லிருந்து டேட்டா ஆப்ஜெக்ட்டாக வந்தாலும் அரேவாக மாற்றிக் கொள்ள பாதுகாப்புச் செக்
                const data = response.data;
                if (Array.isArray(data)) {
                    setWishlist(data);
                } else if (data && Array.isArray(data.wishlist)) {
                    setWishlist(data.wishlist);
                } else if (data && Array.isArray(data.data)) {
                    setWishlist(data.data);
                } else {
                    setWishlist([]);
                }

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch wishlist');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemoveFromWishlist = async (carId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:5000/api/wishlist/${carId}`, config);
            
            // நீக்கிய பிறகு UI-ஐ அப்டேட் செய்தல்
            setWishlist((prevWishlist) => prevWishlist.filter((car) => car._id !== carId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove car from wishlist');
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-lg text-slate-400">Loading wishlist...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-lg text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold mb-8 text-white">My Wishlist</h1>

            {!Array.isArray(wishlist) || wishlist.length === 0 ? (
                <div className="text-center py-16 px-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg">
                    <p className="text-slate-400 mb-5">Your wishlist is empty.</p>
                    <Link to="/cars" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Explore Cars
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((car) => (
                        <div key={car._id} className="bg-slate-900 rounded-xl overflow-hidden shadow-lg flex flex-col border border-slate-800">
                            <div className="h-48 bg-slate-800 overflow-hidden">
                                <img src={car.image || 'https://via.placeholder.com/400x250?text=Car+Image'} alt={car.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <div className="mb-3">
                                    <div className="text-xs text-blue-400 font-bold uppercase mb-1">
                                        {car.brand}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{car.name}</h3>
                                    <p className="text-base font-bold text-green-400 mb-3">
                                        ${car.price} <span className="text-sm text-slate-400 font-normal">/ day</span>
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Link to={`/cars/${car._id}`} className="flex-1 px-4 py-2 bg-blue-600 text-white text-center no-underline rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
                                        View
                                    </Link>
                                    <button onClick={() => handleRemoveFromWishlist(car._id)} className="px-4 py-2 bg-red-600 text-white border-none rounded-md font-bold text-sm cursor-pointer hover:bg-red-700 transition-colors">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;