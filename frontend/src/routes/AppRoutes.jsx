import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Home from '../pages/Home';
import Cars from '../pages/Cars';
import CarDetails from '../pages/CarDetails';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Terms from '../pages/Terms';
import NotFound from '../pages/NotFound';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// User Dashboard Pages
import Profile from '../pages/Profile';
import MyBookings from '../pages/MyBookings';
import Wishlist from '../pages/Wishlist';

// Admin Pages & Protected Routes
import AdminRoutes from './AdminRoutes';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCars from '../pages/admin/AdminCars';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminUsers from '../pages/admin/AdminUsers';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* User Protected Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            {/* Auth Layout Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminRoutes />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/cars" element={<AdminCars />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;