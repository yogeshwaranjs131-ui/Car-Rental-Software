import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoutes = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    let user = null;
    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (err) {
        user = null;
    }

    // Check if user is logged in
    const isAuthenticated = token && user;

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};

export default UserRoutes;