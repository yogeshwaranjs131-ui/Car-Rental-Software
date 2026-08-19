import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api'; // 👈 நம்முடைய சரியான API இன்ஸ்டன்ஸ் இம்போர்ட் செய்யப்பட்டுள்ளது

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                // 👈 இங்கே baseURL ஏற்கனவே /api/v1 என இருப்பதால், நாம் வெறும் /cars/${id} என்று அழைத்தால் போதும்!
                const response = await API.get(`/cars/${id}`);
                
                const carData = response.data.car || response.data.data || response.data;
                setCar(carData);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch car details');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    const getImageUrl = (imagePath) => {
        const placeholder = 'https://via.placeholder.com/800x400?text=Car+Image';
        if (!imagePath) return placeholder;

        if (imagepath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        const normalizedPath = String(imagePath).replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/')
            ? normalizedPath
            : normalizedPath.startsWith('uploads/')
                ? `/${normalizedPath}`
                : `/uploads/${normalizedPath}`;

        // 👈 இமேஜ் URL சரியாகக் கிடைக்க baseURL-ஐ பயன்படுத்துகிறோம்
        const base = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com/api/v1';
        const serverRoot = base.replace(/\/api\/v1$/, ''); // /api/v1-ஐ நீக்கிவிட்டு மெயின் டொமைனை எடுக்கிறோம்
        return `${serverRoot}${cleanPath}`;
    };

    if (loading) {
        return <div className="text-center py-12 text-lg text-slate-400">Loading car details...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-lg text-red-500">{error}</div>;
    }

    if (!car) {
        return <div className="text-center py-12 text-lg text-slate-400">Car not found.</div>;
    }

    const carImage = getImageUrl(car.image);

    return (
        <div className="max-w-6xl mx-auto my-8 p-4 sm:p-6 lg:p-8">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
                {/* Car Image */}
                <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-800">
                    <img src={carImage} alt={car.name || 'Car'} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }} />
                </div>

                <div className="p-6 sm:p-8">
                    {/* Car Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-1">{car.name}</h1>
                            <p className="m-0 text-base text-slate-400">
                                {typeof car.brand === 'object' ? car.brand?.name : car.brand} &bull; {car.model || ''}
                            </p>
                        </div>
                        <div className="text-right shrink-0 mt-2 sm:mt-0">
                            <span className="text-3xl lg:text-4xl font-bold text-emerald-400">₹{car.price || car.pricePerDay}</span>
                            <span className="text-sm text-slate-400 block">/ day</span>
                        </div>
                    </div>

                    <hr className="border-t border-slate-800 my-6" />

                    {/* Specifications */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-800/70 rounded-lg border border-slate-700/80">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">Transmission</span>
                                <strong className="text-base font-bold text-white">{car.transmission || 'Automatic'}</strong>
                            </div>
                            <div className="p-4 bg-slate-800/70 rounded-lg border border-slate-700/80">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">Fuel Type</span>
                                <strong className="text-base font-bold text-white capitalize">{car.fuelType || 'Petrol'}</strong>
                            </div>
                            <div className="p-4 bg-slate-800/70 rounded-lg border border-slate-700/80">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">Seats</span>
                                <strong className="text-base font-bold text-white">{car.seats || '5'} Persons</strong>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-3">Description</h3>
                        <p className="text-base leading-relaxed text-slate-300 m-0">
                            {car.description || 'Experience comfort and luxury with this well-maintained vehicle. Perfect for city drives and long road trips alike. Fully inspected and ready for your next journey.'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-800">
                        <Link to={`/booking/${car._id || car.id}`} className="flex-1 py-3.5 bg-blue-600 text-white text-center no-underline rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                            Book Now
                        </Link>
                        <Link to="/cars" className="flex-1 sm:flex-none py-3.5 px-8 bg-slate-700 text-white text-center no-underline rounded-xl font-bold text-lg hover:bg-slate-600 transition-colors border border-slate-600">
                            Back to Cars
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;