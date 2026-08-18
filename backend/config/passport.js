const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

console.log('========================================');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log(
    'GOOGLE_CLIENT_SECRET exists:',
    !!process.env.GOOGLE_CLIENT_SECRET
);
console.log('========================================');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
                process.env.GOOGLE_CALLBACK_URL ||
                'https://car-rental-software.onrender.com/api/auth/google/callback',
        },

        async (accessToken, refreshToken, profile, done) => {
            // உங்கள் existing code இங்கே தொடரட்டும்
        }
    )
);