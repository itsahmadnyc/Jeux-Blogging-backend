require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,         
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: "http://localhost:5000/auth/google/callback", 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      
      let user = await User.findOne({ where: { googleId: profile.id } });

     
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: 'google-oauth', // placeholder since we use Google
          role: 'user',
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Save user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieve user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
