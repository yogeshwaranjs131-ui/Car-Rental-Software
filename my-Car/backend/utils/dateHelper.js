/**
 *  Date Helper Utility Functions
 */

/**
 * Formats a JavaScript Date object into a string in the format "YYYY-MM-DD".
 * @param {Date|String} date - The date to format.
 * @returns {String} - The formatted date string.
 
 */

const formatDate = (date) => 
{
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return '';
    }
 
const day = String(d.getDate()).padStart(2, '0');
const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = d.getFullYear();
 
return `${year}-${month}-${day}`;
    
};

/**
 * Calculate the number of days two dates
 * @param {Date|String} startDate - The start date.
 * @param {Date|String} endDate - The end date.
 * @returns {Number} - The number of days between the two dates.
 */


const getDayDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days   

    return diffDays === 0 ? 1 : diffDays; // Ensure at least 1 day is counted
};

module.exports = {
    formatDate,
    getDayDifference,
    isValidateRange
};

