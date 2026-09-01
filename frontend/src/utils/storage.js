/**
 * Utility functions for managing browser localStorage and sessionStorage safely.
 */

// --- Local Storage Helpers ---

export const setLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
    }
};

export const getLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) return null;
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return null;
    }
};

export const removeLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage`, error);
    }
};

export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage', error);
    }
};

// --- Session Storage Helpers ---

export const setSessionStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error saving ${key} to sessionStorage`, error);
    }
};

export const getSessionStorage = (key) => {
    try {
        const serializedValue = sessionStorage.getItem(key);
        if (serializedValue === null) return null;
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error(`Error reading ${key} from sessionStorage`, error);
        return null;
    }
};

export const removeSessionStorage = (key) => {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from sessionStorage`, error);
    }
};

export const clearSessionStorage = () => {
    try {
        sessionStorage.clear();
    } catch (error) {
        console.error('Error clearing sessionStorage', error);
    }
};