import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // If token is not present, redirect to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the requested component
    return children;
};

export default ProtectedRoute;