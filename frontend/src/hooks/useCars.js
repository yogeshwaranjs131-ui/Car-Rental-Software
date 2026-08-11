import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const useCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all cars
    const fetchCars = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/cars`);
            setCars(response.data.data || response.data); // 👈 தரவைச் சரியாகப் பிரித்தெடுக்கவும்
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    // Add a new car (Admin)
    const addCar = async (carData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post(`${API_BASE_URL}/api/v1/cars`, carData, config);
            setCars((prevCars) => [...prevCars, response.data]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add car';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Delete a car (Admin)
    const deleteCar = async (carId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${API_BASE_URL}/api/v1/cars/${carId}`, config);
            setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete car';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        cars,
        loading,
        error,
        fetchCars,
        addCar,
        deleteCar
    };
};

export default useCars;