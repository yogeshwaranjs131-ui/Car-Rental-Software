import API from './api';

// Get all cars with optional filters
const getAllCars = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/cars?${params}` : '/cars';
    const response = await API.get(url);
    return response.data;
};

// Get single car by ID
const getCarById = async (carId) => {
    const response = await API.get(`/cars/${carId}`);
    return response.data;
};

// Create a new car (Admin)
const createCar = async (carData) => {
    const response = await API.post('/cars', carData);
    return response.data;
};

// Update car details (Admin)
const updateCar = async (carId, carData) => {
    const response = await API.put(`/cars/${carId}`, carData);
    return response.data;
};

// Delete a car (Admin)
const deleteCar = async (carId) => {
    const response = await API.delete(`/cars/${carId}`);
    return response.data;
};

const carService = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};

export default carService;