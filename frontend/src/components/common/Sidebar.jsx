import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard' }, // Assuming a dashboard route exists
        { name: 'Add Car', path: '/admin/add-car' }, // Corrected path
        { name: 'All Bookings', path: '/admin/bookings' }, // Corrected path
        // Add other admin routes as needed, e.g., Car List, Users, Payments
    ];

    return (
        <aside className="w-64 bg-slate-800 text-white min-h-screen py-5 flex flex-col shadow-lg">
            <div className="px-5 pb-5 border-b border-slate-700">
                <h3 className="m-0 text-xl text-white font-bold">Admin Panel</h3>
            </div>

            <ul className="list-none p-0 mt-5 flex flex-col gap-2">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li key={index} className="w-full">
                            <Link to={item.path} className={`block px-5 py-3 text-base no-underline transition-colors ${isActive ? 'bg-blue-600 text-white font-bold rounded-r-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;