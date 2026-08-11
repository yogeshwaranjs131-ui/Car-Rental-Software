/**
 * Utility function to calculate the total price of car rent
 * @param {Date|String} startDate - Rental start date
 * @param {Date|String} endDate - Rental end date
 * @param {Number} pricePerDay - Price per day for the car
 * @returns {Number} - Total price for the rental period
 */

const calculateTotalPrice = (startDate, endDate, pricePerDay) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

//Validate if dates are valid
if(isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format. Please provide valid start and end dates.');
  }

  // End date cannot be before start date
  if(end < start) {
    throw new Error('End date cannot be before start date.');
  }

  // Convert millisconds to days (1 day = 24 * 60 * 60 * 1000)
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  //Mininum 1 day calculation (even if returned on the same day)
  if(daysDiff === 0) {
    daysDiff = 1;
  }

    const totalPrice = daysDiff * pricePerDay;

    return{
        totalPrice,
        totalDays
    
    };
};

module.exports = {
    calculateTotalPrice
};