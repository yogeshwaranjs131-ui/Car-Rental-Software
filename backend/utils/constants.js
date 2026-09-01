/**
 * Application constants
 */

// User Roles
const USER_ROLES = 
{
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    
};

// Car Fuel Types
const CAR_FUEL_TYPES = 
{
    PETROL: 'petrol',
    DIESEL: 'diesel',
    ELECTRIC: 'electric',
    HYBRID: 'hybrid'
};

//Booking Statuses
const BOOKING_STATUSES = 
{
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
};

// Payment Methods
const PAYMENT_METHODS =
{
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'

};

module.exports = 
{
    USER_ROLES,
    CAR_FUEL_TYPES,
    BOOKING_STATUSES,
    PAYMENT_METHODS
};
