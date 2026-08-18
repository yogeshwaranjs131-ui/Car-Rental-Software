const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            // ==========================================
            // Google OAuth Credentials
            // ==========================================
            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            // ==========================================
            // Google Callback URL
            // ==========================================
            callbackURL:
                process.env.GOOGLE_CALLBACK_URL ||
                'https://car-rental-software.onrender.com/api/auth/google/callback',
        },

        // ==========================================
        // Google Profile Callback
        // ==========================================
        async (accessToken, refreshToken, profile, done) => {
            try {

                console.log(
                    'Google Profile:',
                    profile.displayName,
                    profile.emails?.[0]?.value
                );

                // Get Google email
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(
                        new Error('Google account email not found'),
                        null
                    );
                }

                // ==========================================
                // Check Existing User
                // ==========================================
                let user = await User.findOne({
                    email: email
                });

                if (user) {
                    console.log(
                        'Existing Google User:',
                        user.email
                    );

                    return done(null, user);
                }

                // ==========================================
                // Create New User
                // ==========================================
                user = await User.create({
                    name: profile.displayName || 'Google User',

                    email: email,

                    password: 'TempGooglePassword123@',

                    role: 'user'
                });

                console.log(
                    'New Google User Created:',
                    user.email
                );

                return done(null, user);

            } catch (error) {

                console.error(
                    'Google Strategy Error:',
                    error
                );

                return done(error, null);
            }
        }
    )
);

// ==========================================
// Passport Serialize
// ==========================================
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// ==========================================
// Passport Deserialize
// ==========================================
passport.deserializeUser(async (id, done) => {
    try {

        const user = await User.findById(id);

        done(null, user);

    } catch (error) {

        console.error(
            'Passport Deserialize Error:',
            error
        );

        done(error, null);
    }
});