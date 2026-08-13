const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this email
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    return done(null, user);
                }

                // If user doesn't exist, create a new user automatically
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'TempGooglePassword123@', // Temporary password for social logins
                    role: 'user',
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});