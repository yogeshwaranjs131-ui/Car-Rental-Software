import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (err) {
        user = null;
    }

    // Check if user is logged in and has admin role
    const isAdmin = token && user && user.role === 'admin';

    // If not an admin, redirect to login or home page
    if (!isAdmin) {
        return <Navigate to="/auth/login" replace />;
    }

    // If admin, render the child routes
    return <Outlet />;
};

export default AdminRoutes;