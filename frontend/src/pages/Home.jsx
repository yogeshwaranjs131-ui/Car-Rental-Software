import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const carImages = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&auto=format&fit=crop&q=80'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // 4 வினாடிகளுக்கு ஒருமுறை கார் படங்கள் ஆட்டோமேட்டிக்காக மாறும்
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [carImages.length]);

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-slate-950 m-0 p-0 z-50">
            
            {/* Background Images - Full Height & Width without gaps */}
            {carImages.map((img, index) => (
                <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 z-10 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={img} alt={`Car Slide ${index}`} className="w-full h-full object-cover" />
                </div>
            ))}

            {/* Dark Overlay for clear text visibility */}
            <div className="absolute inset-0 bg-slate-950/60 z-20"></div>

            {/* Main Center Content */}
            <div className="relative z-30 text-center max-w-3xl px-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Executive Fleet
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-5 mb-4 leading-tight">
                    Experience Luxury Car Rental
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Book top-tier executive cars seamlessly with our advanced rental platform and drive with absolute confidence.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link to="/cars" className="bg-blue-600 text-white no-underline text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/50 hover:bg-blue-700 transition-colors">
                        Explore Fleet
                    </Link>
                    <Link to="/login" className="bg-white/10 backdrop-blur-md text-white no-underline text-base font-bold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                        Client Portal
                    </Link>
                </div>
            </div>

            {/* 4 Dots Indicator at Bottom */}
            <div className="absolute bottom-8 flex gap-2 z-40">
                {carImages.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-3 rounded-full border-none cursor-pointer transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-500' : 'w-3 bg-white/50'}`} />
                ))}
            </div>

        </div>
    );
};

export default Home;