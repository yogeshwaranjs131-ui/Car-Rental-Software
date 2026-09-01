import API from './api';

// Create a payment intent or order
const createPaymentIntent = async (paymentData) => {
    const response = await API.post('/payments/create-payment-intent', paymentData);
    return response.data;
};

// Verify and confirm payment status
const verifyPayment = async (paymentVerificationData) => {
    const response = await API.post('/payments/verify', paymentVerificationData);
    return response.data;
};

// Get payment details by booking ID
const getPaymentByBookingId = async (bookingId) => {
    const response = await API.get(`/payments/booking/${bookingId}`);
    return response.data;
};

const paymentService = {
    createPaymentIntent,
    verifyPayment,
    getPaymentByBookingId
};

export default paymentService;