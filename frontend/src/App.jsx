import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

// Admin Pages
import AddCar from "./pages/admin/AddCar";
import AllBookings from "./pages/admin/AllBookings";

// Wishlist மற்றும் FAQ பக்கங்கள் (Pages)
import Wishlist from './pages/Wishlist';
import FAQ from './pages/FAQ';

import Footer from './components/common/Footer';

function App() {
    return (
        <Router basename="/">
            {/* w-full மற்றும் overflow-x-hidden கொடுத்து திரையின் முழு அகலத்திற்கு ஆக்கிரமிக்கச் செய்யப்பட்டுள்ளது */}
            <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 m-0 p-0 w-full overflow-x-hidden">
                
                {/* Navbar */}
                <Navbar />

                {/* Main Content Area - max-w அல்லது mx-auto நீக்கப்பட்டு w-full வழங்கப்பட்டுள்ளது */}
                <main className="grow pt-20 sm:pt-24 pb-12 w-full m-0 p-0">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cars" element={<Cars />} />
                        <Route path="/cars/:id" element={<CarDetails />} />
                        
                        {/* Car Booking Page (With ID) */}
                        <Route path="/booking/:id" element={
                            <ProtectedRoute>
                                <Booking />
                            </ProtectedRoute>
                        } />

                        {/* User Bookings List Page */}
                        <Route path="/my-bookings" element={
                            <ProtectedRoute>
                                <MyBookings />
                            </ProtectedRoute>
                        } />

                        {/* Wishlist Page */}
                        <Route path="/wishlist" element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        } />

                        {/* FAQ Page */}
                        <Route path="/faq" element={<FAQ />} />

                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/change-password" element={
                            <ProtectedRoute>
                                <ChangePassword />
                            </ProtectedRoute>
                        } />
                        <Route path="/payments" element={<Payment />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Admin Routes - AdminLayout முழுமையான வித்-ஐ எடுத்துக்கொள்ளும் */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="add-car" element={<AddCar />} />
                            <Route path="bookings" element={<AllBookings />} />
                        </Route>

                        {/* 404 Fallback Route */}
                        <Route path="*" element={<div className="text-center p-12 text-2xl text-white">404 - Page Not Found</div>} />
                    </Routes>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;