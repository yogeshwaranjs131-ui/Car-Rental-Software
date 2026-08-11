import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Main Header / Navbar */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-10 shadow-sm sticky top-0 z-50">
                <div className="text-xl font-bold text-blue-600">
                    <Link to="/" className="no-underline text-blue-600">CarRental</Link>
                </div>
                
                <nav className="flex gap-6 items-center">
                    <Link to="/" className="no-underline text-gray-700 text-base font-medium hover:text-blue-600 transition-colors">Home</Link>
                    <Link to="/cars" className="no-underline text-gray-700 text-base font-medium hover:text-blue-600 transition-colors">Cars</Link>
                    <Link to="/profile" className="no-underline text-gray-700 text-base font-medium hover:text-blue-600 transition-colors">Profile</Link>
                    <Link to="/auth/login" className="px-4 py-2 bg-blue-600 text-white no-underline rounded-md text-sm font-bold hover:bg-blue-700 transition-colors">
                        Login
                    </Link>
                </nav>
            </header>

            {/* Dynamic Page Content */}
            <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto box-border">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white text-sm text-center p-5 border-t border-gray-700">
                <p className="m-0">&copy; {new Date().getFullYear()} Car Rental Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;