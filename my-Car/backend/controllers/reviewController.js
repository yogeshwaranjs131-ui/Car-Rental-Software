const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all reviews (optional filter by car or user)
// @route   GET /api/v1/reviews
// @access  Public
const getAllReviews = asyncHandler(async (req, res) => {
  const { car, user } = req.query;
  let filter = {};

  if (car) filter.car = car;
  if (user) filter.user = user;

  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name profilePicture')
    .populate('car', 'name brand');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Get single review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name profilePicture')
    .populate('car', 'name brand');

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found!' });
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { car, rating, comment } = req.body;
  const user = req.user.id; // from protect middleware

  const existingReview = await Review.findOne({ user, car });
  if (existingReview) {
    return res.status(400).json({ success: false, message: 'You have already reviewed this car!' });
  }

  const newReview = new Review({ user, car, rating, comment });
  await newReview.save();

  res.status(201).json({ success: true, message: 'Review created successfully!', data: newReview });
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!updatedReview) {
    return res.status(404).json({ success: false, message: 'Review not found!' });
  }

  res.status(200).json({ success: true, message: 'Review updated successfully!', data: updatedReview });
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found!' });
  }

  res.status(200).json({ success: true, message: 'Review deleted successfully!' });
});

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};