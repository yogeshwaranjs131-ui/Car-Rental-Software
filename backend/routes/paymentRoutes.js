const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// 1. Create Order Endpoint
router.post('/create-order', createOrder);

// 2. Verify Payment Endpoint
router.post('/verify-payment', verifyPayment);

module.exports = router;