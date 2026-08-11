/**
 * Utility function to generate structured invoice data for a car rental booking
 * @param {Object} booking - Booking document from database (populated with car, user, location)
 * @returns {Object} - Formatted invoice object
 */
const generateInvoiceData = (booking) => {
  if (!booking) {
    throw new Error('Booking data is required to generate an invoice!');
  }

  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const invoiceDate = new Date();

  return {
    invoiceNumber,
    invoiceDate,
    customer: {
      name: booking.user?.name || 'N/A',
      email: booking.user?.email || 'N/A',
      phone: booking.user?.phone || 'N/A'
    },
    car: {
      name: booking.car?.name || 'N/A',
      brand: booking.car?.brand?.name || 'N/A',
      pricePerDay: booking.pricePerDay || 0
    },
    rentalDetails: {
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalDays: booking.totalDays || 1,
      pickupLocation: booking.pickupLocation || 'N/A'
    },
    pricing: {
      pricePerDay: booking.pricePerDay || 0,
      totalDays: booking.totalDays || 1,
      totalAmount: booking.totalAmount || 0,
      tax: booking.tax || 0,
      discount: booking.discount || 0,
      grandTotal: (booking.totalAmount || 0) + (booking.tax || 0) - (booking.discount || 0)
    },
    paymentStatus: booking.paymentStatus || 'pending',
    bookingStatus: booking.status || 'pending'
  };
};

module.exports = {
  generateInvoiceData
};