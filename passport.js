// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('./models/users');

// expose this function to our app using module.exports
module.exports = function (passport) {

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, done) { 

            User.findOne({ 'username': username.toLocaleLowerCase() }, function (err, user) {

                if (err)
                    return done(err);

                if (!user)
                    return done(new Error('Could not find user')); 

                if (!user.validPassword(password))
                    return done(new Error('Invalid Password')); 

                return done(null, user);
            });

        }));
};
