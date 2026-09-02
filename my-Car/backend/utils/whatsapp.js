const axios = require('axios');

const sendWhatsApp = async ({ phoneNumber, message }) => {
  try {
    const instanceId = process.env.WHATSAPP_INSTANCE_ID;
    const token = process.env.WHATSAPP_TOKEN;

    if (!instanceId || !token) {
      console.error("❌ WhatsApp Instance ID or Token missing in .env file");
      return false;
    }

    // ஃபோன் எண்ணைச் சரிசெய்தல் (91 சேர்த்து 10 இலக்க எண்களாக்குவது)
    let cleanNumber = String(phoneNumber).replace(/\D/g, '');
    if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    }

    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

    const response = await axios.post(url, {
      token: token,
      to: cleanNumber,
      body: message
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && (response.data.sent === 'true' || response.data.sent === true)) {
      console.log(`✅ WhatsApp message sent successfully to: ${cleanNumber}`);
      return true;
    } else {
      console.error(`❌ WhatsApp failed response:`, response.data);
      return false;
    }
  } catch (error) {
    console.error(`❌ WhatsApp Gateway Error:`, error.message);
    return false;
  }
};

module.exports = sendWhatsApp;