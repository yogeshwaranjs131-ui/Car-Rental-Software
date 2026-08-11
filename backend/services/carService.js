const Car = require('../models/Car');

// Create Car Service
const createCarService = async (carData) => {
  const newCar = await Car.create(carData);
  return newCar;
};

// Get All Cars Service (with filters, search, and pagination)
const getAllCarsService = async (queryParams) => {
  const { brand, category, location, fuelType, minPrice, maxPrice, search, sort } = queryParams;
  let filter = {};

  if (brand) filter.brand = brand;
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (fuelType) filter.fuelType = fuelType;

  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  let query = Car.find(filter)
    .populate('brand', 'name logo')
    .populate('category', 'name image')
    .populate('location', 'name city');

  // Sorting
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const cars = await query;
  return cars;
};

// Get Single Car by ID Service
const getCarByIdService = async (carId) => {
  const car = await Car.findById(carId)
    .populate('brand', 'name logo')
    .populate('category', 'name image')
    .populate('location', 'name city');

  if (!car) {
    throw new Error('Car not found!');
  }

  return car;
};

// Update Car Service
const updateCarService = async (carId, updateData) => {
  const updatedCar = await Car.findByIdAndUpdate(carId, updateData, {
    new: true,
    runValidators: true
  })
    .populate('brand', 'name logo')
    .populate('category', 'name image')
    .populate('location', 'name city');

  if (!updatedCar) {
    throw new Error('Car not found!');
  }

  return updatedCar;
};

// Delete Car Service
const deleteCarService = async (carId) => {
  const car = await Car.findByIdAndDelete(carId);
  if (!car) {
    throw new Error('Car not found!');
  }
  return car;
};

module.exports = {
  createCarService,
  getAllCarsService,
  getCarByIdService,
  updateCarService,
  deleteCarService
};