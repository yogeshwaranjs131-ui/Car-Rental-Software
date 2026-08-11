const Insurance = require('../models/Insurance');

// 1. Create or Add Insurance Policy
const addInsurance = async (req, res) => {
  try {
    const newInsurance = new Insurance(req.body);
    await newInsurance.save();
    res.status(201).json({ success: true, message: 'Insurance policy added successfully!', insurance: newInsurance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get All Insurance Policies
const getAllInsurance = async (req, res) => {
  try {
    const policies = await Insurance.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, policies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Delete Insurance Policy
const deleteInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    await Insurance.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Insurance policy deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addInsurance,
  getAllInsurance,
  deleteInsurance
};