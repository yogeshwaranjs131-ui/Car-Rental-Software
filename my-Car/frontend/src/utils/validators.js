/**
 * Utility functions for validating user inputs and form fields.
 */

// Validate Email Format
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate Password Strength (At least 6 characters, can be customized)
export const isValidPassword = (password) => {
    if (!password) return false;
    return password.length >= 6;
};

// Validate Phone Number (Basic 10-digit check or standard format)
export const isValidPhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[-+\s()]/g, ''));
};

// Check if a string or field is empty
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
};

// Validate URL Format
export const isValidUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};