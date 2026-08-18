import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FaHeartBroken, FaShoppingBag } from 'react-icons/fa';

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold text-slate-300">Loading Your Wishlist...</p>
    </div>
);

// Empty Wishlist State Component
const EmptyWishlist = () => (
    <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
        <FaHeartBroken className="mx-auto text-5xl text-slate-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
        <p className="text-slate-400 mb-6">Looks like you haven't added any cars to your wishlist yet.</p>
        <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
            <FaShoppingBag />
            Browse Cars
        </Link>
    </div>
);

// Wishlist Car Card Component
const WishlistCarCard = ({ car, onRemove, loadingRemoveId }) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com/api';
    const imageUrl = car.image.startsWith('http') ? car.image : `${API_BASE_URL.replace('/api', '')}${car.image}`;

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col">
            <img src={imageUrl} alt={car.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col grow">
                <h3 className="text-xl font-bold text-white">{car.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{car.brand}</p>
                <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-400">₹{car.pricePerDay}/day</span>
                    <button
                        onClick={() => onRemove(car._id)}
                        disabled={loadingRemoveId === car._id}
                        className="px-4 py-2 bg-red-600/80 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors disabled:bg-slate-600 disabled:cursor-wait"
                    >
                        {loadingRemoveId === car._id ? 'Removing...' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loadingRemoveId, setLoadingRemoveId] = useState(null);

    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await API.get('/wishlist');
            setWishlist(response.data.wishlist || []);
        } catch (err) {
            setError('Failed to load your wishlist. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const handleRemoveFromWishlist = async (carId) => {
        setLoadingRemoveId(carId);
        try {
            await API.delete(`/wishlist/${carId}`);
            setWishlist((prev) => prev.filter((car) => car._id !== carId));
        } catch (err) {
            setError('Failed to remove item from wishlist.');
            console.error(err);
        } finally {
            setLoadingRemoveId(null);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8 text-center text-red-400">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 border-b-2 border-slate-700 pb-4">
                My Wishlist
            </h1>

            {wishlist.length === 0 ? (
                <EmptyWishlist />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((car) => (
                        <WishlistCarCard
                            key={car._id}
                            car={car}
                            onRemove={handleRemoveFromWishlist}
                            loadingRemoveId={loadingRemoveId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;