const Location = require('../models/Location');

// 1. Add a New Location
const addLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    await newLocation.save();
    res.status(201).json({ success: true, message: 'Location added successfully!', location: newLocation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get All Locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Delete a Location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Location deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addLocation,
  getAllLocations,
  deleteLocation
};