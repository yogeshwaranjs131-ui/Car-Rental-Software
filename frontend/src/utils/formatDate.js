/**
 * Format a given date string or timestamp into a readable date format.
 * 
 * @param {string|Date} dateString - The date to format.
 * @param {Object} options - Custom formatting options for Intl.DateTimeFormat.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return '';
    }

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Format a given date string into both date and time (e.g., Aug 6, 2026, 5:55 PM).
 * 
 * @param {string|Date} dateString - The date to format.
 * @returns {string} The formatted date and time string.
 */
export const formatDateTime = (dateString) => {
    return formatDate(dateString, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};

export default formatDate;