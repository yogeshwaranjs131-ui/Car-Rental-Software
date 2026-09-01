import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900/80 text-white text-sm mt-auto border-t-2 border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] px-5 py-10">
            <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                
                {/* Corporate Info */}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                    <img
                        src="https://as1.ftcdn.net/jpg/00/65/83/52/1000_F_65835204_1jWSKhWvq7ncBkT3KZrNmm506Dorzu6q.jpg"
                        alt="Car Rental Logo"
                        className="w-12 h-12 rounded-full object-cover mb-2.5 border-2 border-blue-500"
                    />
                    <h3 className="text-lg font-extrabold text-white mb-2.5">Car Rental Corporate</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        Providing high-end executive fleet rentals with absolute safety, reliability, and professional standard.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-base font-bold text-white mb-2.5">Navigation</h4>
                    <ul className="flex flex-col gap-2">
                        <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors text-xs">Home</Link></li>
                        <li><Link to="/cars" className="text-slate-400 hover:text-blue-400 transition-colors text-xs">Cars</Link></li>
                        <li><Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors text-xs">About Us</Link></li>
                        <li><Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors text-xs">Contact</Link></li>
                    </ul>
                </div>

                {/* Corporate Support */}
                <div>
                    <h4 className="text-base font-bold text-white mb-2.5">Support</h4>
                    <ul className="flex flex-col gap-2">
                        <li><span className="text-slate-400 hover:text-blue-400 transition-colors text-xs cursor-pointer">Customer Assistance</span></li>
                        <li><span className="text-slate-400 hover:text-blue-400 transition-colors text-xs cursor-pointer">Rental Policies</span></li>
                        <li><span className="text-slate-400 hover:text-blue-400 transition-colors text-xs cursor-pointer">Privacy Terms</span></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div>
                    <h4 className="text-base font-bold text-white mb-2.5">Contact Corporate</h4>
                    <div className="flex flex-col gap-2 text-slate-400 text-xs">
                        <p>📧 corporate@carrental.com</p>
                        <p>📞 +91 98765 43210</p>
                        <p>📍 Tech Park, Chennai, India</p>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="max-w-7xl mx-auto text-center border-t border-slate-800 pt-5 text-slate-500 text-xs flex justify-between items-center flex-wrap gap-2">
                <p>&copy; {new Date().getFullYear()} Car Rental Software. All rights reserved.</p>
                <p>Enterprise Mobility Solution</p>
            </div>
        </footer>
    );
};

export default Footer;