const Coupon = require('../models/Coupon');

// 1. Create a New Coupon (স্বயமமாக கேப்ஸ்லாக்கில் சேமிக்கும்படி மாற்றப்பட்டுள்ளது)
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required!' });
    }

    const upperCode = code.toUpperCase();
    const existingCoupon = await Coupon.findOne({ code: upperCode });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists!' });
    }

    const newCoupon = new Coupon({ 
      code: upperCode, 
      discountPercentage, 
      expiryDate 
    });
    await newCoupon.save();

    res.status(201).json({ success: true, message: 'Coupon created successfully!', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Validate Coupon (சின்ன எழுத்தில் அடித்தாலும் .toUpperCase() மூலம் சரிபார்க்கும்)
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code!' });
    }

    const upperCode = code.toUpperCase();
    const coupon = await Coupon.findOne({ code: upperCode });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code!' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired!' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Coupon applied successfully!', 
      discountPercentage: coupon.discountPercentage 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Get All Coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Delete a Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    await Coupon.findByIdAndDelete(couponId);
    res.status(200).json({ success: true, message: 'Coupon deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCoupon,
  validateCoupon,
  getAllCoupons,
  deleteCoupon
};