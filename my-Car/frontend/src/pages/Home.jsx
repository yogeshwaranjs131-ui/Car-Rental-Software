import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const carVideos = [
    "/car1.mp4",
    "/car2.mp4",
];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef(null);

    // ============================================
    // NEXT VIDEO WHEN CURRENT VIDEO ENDS
    // ============================================
    const handleVideoEnded = () => {
        setCurrentIndex((prevIndex) => {
            return (prevIndex + 1) % carVideos.length;
        });
    };

    // ============================================
    // PLAY CURRENT VIDEO
    // ============================================
    useEffect(() => {
        if (!videoRef.current) return;

        videoRef.current.currentTime = 0;

        videoRef.current.play().catch((error) => {
            console.log("Autoplay prevented:", error);
        });
    }, [currentIndex]);

    return (
        <div className="fixed inset-0 w-full h-screen overflow-hidden">

            {/* ==========================================
                FULL SCREEN VIDEO
            ========================================== */}
            <video
                key={currentIndex}
                ref={videoRef}
                src={carVideos[currentIndex]}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* ==========================================
                MAIN CONTENT
            ========================================== */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6">

                <div className="w-full max-w-4xl text-center">

                    {/* ==================================
                        BADGE
                    ================================== */}
                    <div className="mb-5 sm:mb-6">
                        <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest shadow-xl">

                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>

                            Executive Fleet

                        </span>
                    </div>

                    {/* ==================================
                        MAIN HEADING
                    ================================== */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">

                        Experience

                        <span className="block text-blue-400 mt-2">
                            Luxury Car Rental
                        </span>

                    </h1>

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}
                    <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-2xl">

                        Discover premium vehicles, flexible rental plans,
                        and seamless booking — all in one powerful car
                        rental platform.

                    </p>

                    {/* ==================================
                        BUTTONS
                    ================================== */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-7 sm:mt-9">

                        {/* Register */}
                        <Link
                            to="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 no-underline"
                        >
                            Register Now
                        </Link>

                        {/* Login */}
                        <Link
                            to="/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-white/50 transition-all duration-300 hover:-translate-y-1 no-underline"
                        >
                            Login
                        </Link>

                    </div>

                    {/* ==================================
                        EXPLORE CARS
                    ================================== */}
                    <div className="mt-5">

                        <Link
                            to="/cars"
                            className="inline-block text-white hover:text-blue-300 font-semibold text-sm sm:text-base transition-colors no-underline drop-shadow-2xl"
                        >
                            Explore Our Cars →
                        </Link>

                    </div>

                </div>
            </div>

            {/* ==========================================
                VIDEO DOTS
            ========================================== */}
            <div className="absolute bottom-7 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">

                {carVideos.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Play video ${index + 1}`}
                        className={`h-3 rounded-full border-0 cursor-pointer transition-all duration-500 ${
                            index === currentIndex
                                ? "w-10 bg-blue-500 shadow-lg shadow-blue-500/50"
                                : "w-3 bg-white/80 hover:bg-white"
                        }`}
                    />
                ))}

            </div>

            {/* ==========================================
                VIDEO COUNTER
            ========================================== */}
            <div className="absolute bottom-7 sm:bottom-8 right-5 sm:right-8 z-30 hidden sm:block">

                <div className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white">

                    <span className="font-bold text-blue-300">
                        0{currentIndex + 1}
                    </span>

                    <span className="mx-2 text-white/70">
                        /
                    </span>

                    <span className="text-white">
                        0{carVideos.length}
                    </span>

                </div>

            </div>

            {/* ==========================================
                SCROLL INDICATOR
            ========================================== */}
            <div className="absolute bottom-7 sm:bottom-8 left-5 sm:left-8 z-30 hidden md:flex flex-col items-center gap-2 text-white">

                <span className="text-[10px] uppercase tracking-[0.3em] drop-shadow-lg">
                    Scroll
                </span>

                <div className="w-px h-10 bg-white/70"></div>

            </div>

        </div>
    );
};

export default Home;