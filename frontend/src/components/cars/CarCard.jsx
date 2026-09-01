import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
    // கார்களின் பெயருக்கு ஏற்ப வெவ்வேறு டிஃபால்ட் படங்கள் வருமாறு மாற்றப்பட்டுள்ளது
    const getDefaultImage = (carName) => {
        const fallbacks = [
            'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
            'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
            'https://images.unsplash.com/photo-1617808929739-d4c247660d38?w=800',
            'https://images.unsplash.com/photo-1555353540-64580b51c258?w=800'
        ];
        // காரின் பெயரின் அடிப்படையில் ஒரு படத்தை செலக்ட் செய்யும்
        const index = carName ? carName.length % fallbacks.length : 0;
        return fallbacks[index];
    };

    const rawImage = 
        car.image || 
        car.imageUrl || 
        car.img || 
        car.carImage || 
        car.photo;

    const carImage = (rawImage && rawImage.trim() !== '') ? rawImage : getDefaultImage(car.name);

    return (
        <div className="relative group w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700/80 shadow-lg flex flex-col h-full m-0 p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500">
            
            {/* Car Image Container */}
            <div className="w-full h-48 bg-slate-950 overflow-hidden relative m-0 p-0 block leading-none">
                <img 
                    src={carImage} 
                    alt={car.name || 'Car'} 
                    className="w-full h-full object-cover block m-0 p-0 border-0 transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800';
                    }}
                />

                {/* Hover Details Box */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                        {car.brand || 'Luxury Fleet'}
                    </span>
                    <h3 className="text-white text-base font-bold drop-shadow-md">
                        {car.name}
                    </h3>
                    <p className="text-emerald-400 text-sm font-semibold mt-1">
                        ₹{car.pricePerDay} / day
                    </p>
                </div>
            </div>

            {/* Car Details Container */}
            <div className="p-4 flex flex-col grow justify-between bg-slate-900 m-0">
                <div>
                    <h3 className="text-white text-lg font-bold mb-2 truncate">
                        {car.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-1">
                        Brand: <span className="text-slate-200">{car.brand}</span>
                    </p>
                    <p className="text-slate-400 text-sm mb-4">
                        Category: <span className="text-slate-200">{car.category}</span>
                    </p>
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-800">
                    <span className="text-emerald-400 text-base font-bold">
                        ₹{car.pricePerDay} / day
                    </span>
                    <Link 
                        to={`/cars/${car._id || car.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-semibold transition shadow-md"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarCard;