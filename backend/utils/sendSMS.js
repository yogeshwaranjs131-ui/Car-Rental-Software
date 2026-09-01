const axios = require('axios');

/**
 * Mobile number-ஐ Fast2SMS-க்கு ஏற்றவாறு (10 இலக்க எண்களாக) மாற்றுவது
 */
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  const value = String(phoneNumber).trim();
  const digits = value.replace(/\D/g, '');

  if (!digits) return value;
  // Fast2SMS-க்கு கடைசி 10 இலக்க எண்கள் தேவை (எ.கா: 9688304798)
  if (digits.length > 10) {
      return digits.slice(-10);
  }
  return digits;
};

const sendSMS = async (options) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      console.error("❌ Fast2SMS API Key missing in .env file");
      throw new Error('Fast2SMS API Key missing!');
    }

    const cleanPhoneNumber = normalizePhoneNumber(options.phoneNumber);

    if (!cleanPhoneNumber || cleanPhoneNumber.length !== 10) {
      throw new Error('Invalid Indian mobile number for Fast2SMS!');
    }

    // Fast2SMS Quick SMS API (GET method)
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
        params: {
            authorization: apiKey,
            message: options.message,
            language: 'english',
            route: 'q', // Quick SMS route
            numbers: cleanPhoneNumber
        }
    });

    if (response.data && response.data.return) {
        console.log(`✅ Fast2SMS sent successfully to: ${cleanPhoneNumber}`);
        return { success: true, response: response.data };
    } else {
        console.error(`❌ Fast2SMS failed response:`, response.data);
        throw new Error('SMS sending failed from gateway!');
    }

  } catch (error) {
    console.error(`Failed to send SMS: ${error.message}`);
    throw new Error('SMS sending failed!');
  }
};

module.exports = sendSMS;