import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/booking/BookingForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Coupon States
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');

    // Review States
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');

    // Background Image Slider States
    const carImages = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop&q=80'
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch Car Details and Reviews with Robust Fallback Mechanism
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                let foundCar = null;

                // 1. ஐடி சரியான MongoDB ObjectId வடிவத்திலிருக்கிறதா என்று சோதிக்கிறோம்
                const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id);

                if (isValidMongoId) {
                    try {
                        const res = await axios.get(`${API_BASE_URL}/api/v1/cars/${id}`);
                        foundCar = res.data.data || res.data.car || res.data;
                    } catch (directErr) {
                        console.warn('Direct ID fetch failed, switching to list fallback...');
                    }
                }

                // 2. நேரடி ஃபெட்ச் அல்லது ஐடி செல்லாததாக இருந்தால், அனைத்து கார்களின் பட்டியலிலிருந்து தேடுகிறோம்
                if (!foundCar) {
                    const allRes = await axios.get(`${API_BASE_URL}/api/v1/cars`);
                    const allCars = allRes.data.data || allRes.data.cars || allRes.data;
                    
                    if (Array.isArray(allCars) && allCars.length > 0) {
                        foundCar = allCars.find(c => c._id === id || c.id === id);
                        
                        if (!foundCar) {
                            foundCar = allCars[0];
                        }
                    }
                }

                if (foundCar) {
                    setCar(foundCar);
                } else {
                    throw new Error('Car not found in database.');
                }

                // Reviews Fetch
                try {
                    const carTargetId = foundCar._id || foundCar.id || id;
                    const reviewRes = await axios.get(`${API_BASE_URL}/api/v1/reviews?car=${carTargetId}`);
                    setReviews(reviewRes.data.data || reviewRes.data.reviews || []);
                } catch (revErr) {
                    console.warn('Reviews fetch skipped:', revErr.message);
                }

            } catch (err) {
                console.error('Error fetching details:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCarData();
        } else {
            setLoading(false);
            setError('Car ID is missing in the URL.');
        }
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carImages.length]);

    const handleAddToWishlist = async () => {
        try {
            setWishlistLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first to add cars to your wishlist! 🔒');
                navigate('/login');
                return;
            }

            await axios.post(`${API_BASE_URL}/api/v1/wishlist`, { carId: car._id || car.id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Car added to your wishlist successfully! ❤️');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add car to wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleApplyCoupon = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/coupons/apply`, { code: couponCode });
            const discountPercent = res.data.discountPercentage || res.data.discount || 0;
            setDiscount(discountPercent);
            setCouponMessage(`Success! ${discountPercent}% discount applied. 🎉`);
        } catch (err) {
            setCouponMessage(err.response?.data?.message || 'Invalid or expired coupon ❌');
            setDiscount(0);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to post a review! 🔒');
                navigate('/login');
                return;
            }

            // localStorage-இல் உள்ள user ஆப்ஜெக்டில் இருந்து userId-ஐப் பாதுகாப்பாக எடுக்கவும்
            const userString = localStorage.getItem('user');
            const userInfo = userString ? JSON.parse(userString) : {};
            const userId = userInfo?._id || userInfo?.id;

            await axios.post(`${API_BASE_URL}/api/v1/reviews`, {
                user: userId,
                car: car._id || car.id || id,
                rating: newRating,
                comment: newComment
            }, {
                headers: { Authorization: `Bearer ` + token }
            });

            alert('Review posted successfully! ⭐');
            setNewComment('');

            const targetCarId = car._id || car.id || id;
            const reviewRes = await axios.get(`${API_BASE_URL}/api/v1/reviews?car=${targetCarId}`);
            setReviews(reviewRes.data.data || reviewRes.data.reviews || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post review. Make sure you are logged in correctly.');
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex items-center justify-center bg-slate-950 text-white text-lg mt-24">
                Loading car details...
            </div>
        );
    }
    
    if (error || !car) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 text-white text-lg px-4 mt-24">
                <p className="text-red-400 mb-4 font-medium text-center">⚠️ {error || 'Car not found'}</p>
                <button 
                    onClick={() => navigate('/')} 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-lg cursor-pointer"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const baseCarPrice = car.pricePerDay || car.price || 0;
    const finalCarPrice = discount > 0 ? baseCarPrice - (baseCarPrice * discount) / 100 : baseCarPrice;
    
    const carBrand = typeof car.brand === 'object' && car.brand !== null ? car.brand?.name : car.brand;

    return (
        <div className="relative w-full min-h-screen bg-slate-950 py-10 px-4 mt-20 sm:mt-24 flex items-start justify-center overflow-hidden">
            {carImages.map((img, index) => (
                <div 
                    key={index} 
                    className={`fixed inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 z-0 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url(${img})` }} 
                />
            ))}

            <div className="fixed inset-0 z-10 bg-slate-950/80 backdrop-blur-sm"></div>

            <div className="relative z-20 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-slate-700 w-full max-w-3xl shadow-2xl text-slate-100 my-auto">
                
                {/* இங்கே navigate(-1) மாற்றப்பட்டு நேராக ஹோம் பேஜுக்கு (/) செல்லும்படி செய்யப்பட்டுள்ளது */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-1.5 rounded-lg text-sm transition font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                    &larr; Back to Home
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">{car.name}</h2>
                    <p className="text-sm text-slate-300 mt-1">
                        {carBrand ? `Brand: ${carBrand} | ` : ''}Rate: 
                        {discount > 0 ? (
                            <span>
                                <span className="line-through text-slate-400 mr-2">₹{baseCarPrice}</span>
                                <strong className="text-emerald-400">₹{finalCarPrice.toFixed(2)} / day</strong>
                            </span>
                        ) : (
                            <strong className="text-blue-400"> ₹{baseCarPrice} / day</strong>
                        )}
                    </p>

                    <button
                        onClick={handleAddToWishlist}
                        disabled={wishlistLoading}
                        className="mt-4 px-5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm transition font-medium shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-rose-500/20"
                    >
                        <span>❤️</span> {wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
                    </button>
                </div>

                <div className="mb-6 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Have a Coupon Code?</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Enter code (e.g., FIRST50)" 
                            value={couponCode} 
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm uppercase focus:outline-none focus:border-blue-500"
                        />
                        <button 
                            type="button"
                            onClick={handleApplyCoupon}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                    {couponMessage && (
                        <p className={`text-xs mt-2 ${discount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {couponMessage}
                        </p>
                    )}
                </div>

                <BookingForm carId={car._id || car.id} pricePerDay={finalCarPrice} />

                <div className="mt-8 pt-6 border-t border-slate-800 text-slate-100">
                    <h3 className="text-lg font-semibold mb-3">Customer Reviews & Ratings ⭐</h3>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                        {Array.isArray(reviews) && reviews.length > 0 ? (
                            reviews.map((rev, index) => (
                                <div key={index} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50 text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-blue-400">{rev.user?.name || 'User'}</span>
                                        <span className="text-yellow-400 font-bold">{'★'.repeat(rev.rating || 5)}</span>
                                    </div>
                                    <p className="text-slate-300">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400">No reviews yet for this car. Be the first to review!</p>
                        )}
                    </div>

                    <form onSubmit={handleReviewSubmit} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-3">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Leave a Review</h4>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-400">Rating:</label>
                            <select 
                                value={newRating} 
                                onChange={(e) => setNewRating(Number(e.target.value))}
                                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                            >
                                <option value="5">5 - Excellent ⭐⭐⭐⭐⭐</option>
                                <option value="4">4 - Good ⭐⭐⭐⭐</option>
                                <option value="3">3 - Average ⭐⭐⭐</option>
                                <option value="2">2 - Poor ⭐⭐</option>
                                <option value="1">1 - Terrible ⭐</option>
                            </select>
                        </div>
                        <textarea 
                            placeholder="Write your review here..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 h-16 resize-none"
                        />
                        <button 
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Booking;