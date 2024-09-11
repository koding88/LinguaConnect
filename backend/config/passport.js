const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('../services/auth.Service');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:3000/api/v1/auth/google/redirect`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const token = await authService.loginGoogle(profile);
                done(null, token);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

module.exports = passport;