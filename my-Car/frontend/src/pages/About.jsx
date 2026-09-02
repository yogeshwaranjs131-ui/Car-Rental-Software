import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white">
            <h1 className="text-4xl font-bold mb-6 text-blue-500 text-center">About Car Rental Portal</h1>
            
            <p className="text-base leading-relaxed mb-5 text-slate-300">
                Welcome to Car Rental Portal, your trusted partner for reliable, affordable, and seamless car rental services. Whether you are planning a weekend getaway, a business trip, or need a daily commute vehicle, we provide a wide range of well-maintained cars to suit your journey.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Our Mission</h3>
            <p className="text-base leading-relaxed mb-5 text-slate-300">
                Our mission is to simplify vehicle rentals through a transparent, secure, and user-friendly digital platform. We strive to offer the best customer experience with flexible booking options, competitive pricing, and 24/7 support.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-white">Why Choose Us?</h3>
            <ul className="list-disc list-inside text-base leading-relaxed pl-5 text-slate-300">
                <li><strong>Wide Variety of Cars:</strong> From hatchbacks and sedans to luxury SUVs.</li>
                <li><strong>Easy Booking Process:</strong> Simple and fast reservation system with secure online payments.</li>
                <li><strong>Verified Fleet:</strong> Regularly serviced, clean, and safe vehicles for every trip.</li>
                <li><strong>Transparent Pricing:</strong> No hidden charges or unexpected fees.</li>
            </ul>

            <div className="mt-10 p-5 bg-slate-900 rounded-xl text-center border-l-4 border-blue-500 shadow-lg">
                <h4 className="text-xl font-semibold mb-2 text-white">Have Questions?</h4>
                <p className="m-0 text-base text-slate-400">
                    Feel free to reach out to our support team or check our cars gallery to start your booking today!
                </p>
            </div>
        </div>
    );
};

export default About;