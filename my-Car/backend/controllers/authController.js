const User = require('../models/User');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mail'); // 👈 ஏற்கனவே உள்ள transporter-ஐ import செய்யவும்
const axios = require('axios');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// 1. Register User (எரர் வராதபடி மற்றும் ஆட்டோ லாகின் வசதியுடன்)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // ஏற்கனவே யூசர் இருக்கிறாரா என சோதித்தல்
        let user = await User.findOne({ email });

        if (user) {
            // 🛑 முன்பு 400 எரர் அனுப்பினோம், இப்போது அது வராது!
            // மாறாக, ஏற்கனவே யூசர் இருந்தால் அவரே லாகின் செய்ததாகக் கருதி Token-ஐ வழங்கிவிடுவோம்.
            const token = generateToken(user._id, user.role);

            return res.status(200).json({
                success: true,
                message: "User already exists, logged in automatically!",
                token: token,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // 4 இலக்க OTP உருவாக்குதல்
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpire = Date.now() + 10 * 60 * 1000; // 10 நிமிடங்கள் செல்லும்

        user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'user',
            otp,
            otpExpire
        });

        if (user) {
            const cleanPhoneNumber = phone ? phone.replace(/^\+91/, '').trim() : '';
            const smsMessage = `Hello ${name}, your Car Rental Software OTP is: ${otp}. Valid for 10 minutes.`;
            
            // 🚗 லோகோவின் நேரடி இணையப் படம் (Direct Image URL)
            const logoUrl = 'https://as2.ftcdn.net/v2/jpg/06/58/35/20/1000_F_65835204_...jpg'; 

            // 📱 A. Fast2SMS மூலம் SMS அனுப்புவது
            if (phone && process.env.FAST2SMS_API_KEY) {
                try {
                    await axios.post('https://www.fast2sms.com/dev/bulkV2', {
                        route: 'q',
                        message: smsMessage,
                        language: 'english',
                        flash: 0,
                        numbers: cleanPhoneNumber,
                    }, {
                        headers: {
                            'authorization': process.env.FAST2SMS_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log("Fast2SMS OTP sent successfully!");
                } catch (smsErr) {
                    console.error("Fast2SMS OTP failed:", smsErr.response?.data || smsErr.message);
                }
            }

            // 📧 B. Gmail SMTP (Nodemailer) மூலம் லோகோ படத்துடன் கூடிய ஈமெயில் அனுப்புவது
            if (email && process.env.SMTP_USER) {
                try { 
                    await transporter.sendMail({ 
                        from: `"Car Rental Support" <${process.env.SMTP_SENDER_EMAIL}>`,
                        to: email,
                        subject: 'Your Registration OTP - Car Rental Software',
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 500px; margin: auto; border-radius: 8px;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <img src="${logoUrl}" alt="Car Rental Logo" style="width: 120px; height: auto;" />
                                </div>
                                <h2 style="color: #333; text-align: center;">Car Rental Software</h2>
                                <p>Hello ${name},</p>
                                <p>Your OTP for registration is:</p>
                                <div style="background: #f4f4f4; padding: 12px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #d9534f; border-radius: 5px;">
                                    ${otp}
                                </div>
                                <p style="margin-top: 20px; color: #666; font-size: 12px; text-align: center;">This code is valid for 10 minutes. Thank you!</p>
                            </div>
                        `,
                    });
                    console.log("Gmail OTP sent successfully with Logo!");
                } catch (emailErr) {
                    console.error("Gmail OTP failed:", emailErr.message);
                }
            }

            // 💬 C. WhatsApp மூலமாக லோகோ படத்துடன் கூடிய OTP அனுப்புவது
            if (phone && process.env.WHATSAPP_INSTANCE_ID && process.env.WHATSAPP_TOKEN) {
                try {
                    await axios.post(`https://api.ultramsg.com/${process.env.WHATSAPP_INSTANCE_ID}/messages/image`, {
                        token: process.env.WHATSAPP_TOKEN,
                        to: cleanPhoneNumber,
                        image: logoUrl,
                        caption: `🚗 *Car Rental Software*\n\nHello *${name}*,\nYour Verification OTP is: *${otp}*\n\nValid for 10 minutes.`
                    });
                    console.log("WhatsApp OTP sent successfully with Logo!");
                } catch (waErr) {
                    console.error("WhatsApp OTP failed:", waErr.response?.data || waErr.message);
                }
            }

            return res.status(201).json({
                success: true,
                message: 'User registered & OTP triggered with Logo via Gmail, WhatsApp & Fast2SMS!',
                token: generateToken(user._id, user.role),
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        
        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                success: true,
                message: 'User logged in successfully!',
                token: generateToken(user._id, user.role),
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Separate Send OTP Controller
const sendOTP = async (req, res) => {
    try {
        const { email, phone, name } = req.body;
        
        if (!email && !phone) {
            return res.status(400).json({ success: false, message: 'Email or Phone number is required' });
        }

        let user = await User.findOne({ $or: [{ email }, { phone }] });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpire = Date.now() + 10 * 60 * 1000;

        if (!user) {
            user = await User.create({
                name: name || 'Customer',
                email: email || '',
                phone: phone || '',
                password: 'TempPassword123@',
                otp,
                otpExpire
            });
        } else {
            user.otp = otp;
            user.otpExpire = otpExpire;
            await user.save();
        }

        const smsMessage = `Your Car Rental Software OTP is: ${otp}. Valid for 10 minutes.`;
        const cleanPhoneNumber = phone ? phone.replace(/^\+91/, '').trim() : '';
        const logoUrl = 'https://as2.ftcdn.net/v2/jpg/06/58/35/20/1000_F_65835204_...jpg';

        // SMS
        if (phone && process.env.FAST2SMS_API_KEY) {
            try {
                await axios.post('https://www.fast2sms.com/dev/bulkV2', {
                    route: 'q', message: smsMessage, language: 'english', flash: 0, numbers: cleanPhoneNumber,
                }, { headers: { 'authorization': process.env.FAST2SMS_API_KEY, 'Content-Type': 'application/json' } });
            } catch (smsErr) { console.error("Fast2SMS failed:", smsErr.message); }
        }

        // Email with Logo
        if (email && process.env.SMTP_USER) {
            try {
                await transporter.sendMail({ 
                    from: `"Car Rental Support" <${process.env.SMTP_SENDER_EMAIL}>`,
                    to: email,
                    subject: 'Verification OTP',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 500px; margin: auto;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="${logoUrl}" alt="Logo" style="width: 120px;" />
                            </div>
                            <h3>Verification Code</h3>
                            <p>Your OTP is: <strong>${otp}</strong></p>
                        </div>
                    `,
                });
            } catch (emailErr) { console.error("Email failed:", emailErr.message); }
        }

        // WhatsApp with Logo Image
        if (phone && process.env.WHATSAPP_INSTANCE_ID && process.env.WHATSAPP_TOKEN) {
            try {
                await axios.post(`https://api.ultramsg.com/${process.env.WHATSAPP_INSTANCE_ID}/messages/image`, {
                    token: process.env.WHATSAPP_TOKEN, 
                    to: cleanPhoneNumber, 
                    image: logoUrl,
                    caption: `🚗 *Car Rental Software*\n\nYour OTP is: *${otp}*\nValid for 10 minutes.`
                });
            } catch (waErr) { console.error("WhatsApp failed:", waErr.message); }
        }

        return res.status(200).json({ success: true, message: 'OTP sent successfully with Logo!' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { registerUser, loginUser, sendOTP, generateToken };