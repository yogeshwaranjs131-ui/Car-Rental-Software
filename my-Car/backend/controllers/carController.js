const Car = require('../models/Car');

// @desc    Get all cars with optional filters
// @route   GET /api/cars
// @access  Public
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();

        res.status(200).json({ 
            success: true, 
            count: cars.length, 
            data: cars 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found!'
            });
        }

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Add a new car with image upload support
// @route   POST /api/cars
// @access  Private/Admin
const addCar = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imagePath = req.body.image;
        }

        const newCar = new Car({
            ...req.body,
            image: imagePath
        });

        await newCar.save();
        res.status(201).json({ 
            success: true, 
            message: 'Car added successfully', 
            data: newCar 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// @desc    Update car details (with Image update support)
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // ஒருவேளை அப்்டேட் செய்யும்போது புதிய படம் அப்லோட் செய்யப்பட்டால்:
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCar) {
            return res.status(404).json({
                success: false,
                message: 'Car not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Car updated successfully!',
            data: updatedCar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Car deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar
};