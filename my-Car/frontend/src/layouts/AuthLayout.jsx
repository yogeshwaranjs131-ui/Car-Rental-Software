import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 p-5">
            <div className="w-full max-w-md bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-8 box-border text-white">
                <div className="text-center mb-6">
                    <h2 className="m-0 text-3xl font-bold text-white mb-2">Car Rental Portal</h2>
                    <p className="m-0 text-sm text-slate-400">Please sign in or register to continue</p>
                </div>

                {/* Nested Auth Routes (Login / Register) will render here */}
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;