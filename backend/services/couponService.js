const Coupon = require('../models/coupon');

// Create Coupon Service
const createCouponService = async (couponData) => {
  const { code, discountPercentage, expiryDate, isActive } = couponData;

  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    throw new Error('Coupon code already exists!');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountPercentage,
    expiryDate,
    isActive: isActive !== undefined ? isActive : true
  });

  return coupon;
};

// Get All Coupons Service
const getAllCouponsService = async () => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return coupons;
};

// Validate and Apply Coupon Service
const validateCouponService = async (code) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    throw new Error('Invalid coupon code!');
  }

  if (!coupon.isActive) {
    throw new Error('This coupon is inactive!');
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    throw new Error('This coupon has expired!');
  }

  return coupon;
};

// Delete Coupon Service
const deleteCouponService = async (couponId) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);
  if (!coupon) {
    throw new Error('Coupon not found!');
  }
  return coupon;
};

module.exports = {
  createCouponService,
  getAllCouponsService,
  validateCouponService,
  deleteCouponService
};