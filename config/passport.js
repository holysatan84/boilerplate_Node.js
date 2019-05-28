const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./keys');

require('../models/User'); 
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true
    },
        function (accessToken, refreshToken, profile, done) {
            // console.log(accessToken);
            //console.log(profile);
            const newUser = {
                googleID: profile.id,
                email: profile.emails[0].value,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                image: profile.photos[0].value
            }
            //Check for existing user
            User.findOne({ googleID: profile.id })
                .then(user => {
                    if (user) {
                        //Return User
                        done(null, user);
                    }
                    else {
                        //Create user
                        new User(newUser)
                        .save()
                        .then(user =>done(null,user));
                    }
                });
        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}