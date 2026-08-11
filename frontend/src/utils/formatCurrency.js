/**
 * Format a given number into a localized currency string.
 * Default is USD ($), but can be customized for other currencies.
 * 
 * @param {number} amount - The numerical amount to format.
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR', 'INR').
 * @param {string} locale - The locale string (e.g., 'en-US', 'en-IN').
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    if (isNaN(amount) || amount === null) {
        amount = 0;
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

export default formatCurrency;