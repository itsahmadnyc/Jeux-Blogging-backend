const passport = require("passport");
const GoogleStrategy = require('passport.google-oauth20').Strategy;
const {user, User} = require('../models');
const jwt = require('jsonwebtoken');


passport.use(new GoogleStrategy({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_DECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) =>{

    try{
        let user = await User.findOne({ where: { googleId: profile.id } });
if(!user){
    user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id
    });
}

return done(null, user);

    }catch(error){
        return done(error, null);
    }

}
));