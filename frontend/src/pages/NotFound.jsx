import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-5 text-white">
            <h1 className="text-8xl font-extrabold text-blue-500 mb-2">404</h1>
            <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-base text-slate-400 max-w-md mb-6 leading-relaxed">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="px-6 py-3 bg-blue-600 text-white no-underline rounded-md text-base font-bold shadow-lg hover:bg-blue-700 transition-colors">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;