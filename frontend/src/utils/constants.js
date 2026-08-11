// Base API URL for backend communication
export const API_BASE_URL = 'http://localhost:5000/api';

// Application Routes / Paths
export const ROUTES = {
    HOME: '/',
    CARS: '/cars',
    CAR_DETAILS: '/cars/:id',
    CONTACT: '/contact',
    FAQ: '/faq',
    PRIVACY_POLICY: '/privacy-policy',
    TERMS: '/terms',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password/:token',
    PROFILE: '/profile',
    MY_BOOKINGS: '/my-bookings',
    WISHLIST: '/wishlist',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_CARS: '/admin/cars',
    ADMIN_BOOKINGS: '/admin/bookings',
    ADMIN_USERS: '/admin/users'
};

// Booking Status Options
export const BOOKING_STATUS = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed'
};

// Car Categories / Brands Filter Options
export const CAR_BRANDS = [
    'All',
    'Toyota',
    'Honda',
    'BMW',
    'Mercedes',
    'Audi',
    'Hyundai',
    'Ford'
];

// Fuel Type Options
export const FUEL_TYPES = [
    'Petrol',
    'Diesel',
    'Electric',
    'Hybrid'
];

// Transmission Type Options
export const TRANSMISSION_TYPES = [
    'Automatic',
    'Manual'
];