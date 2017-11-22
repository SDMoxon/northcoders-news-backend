// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('./models/users');

// expose this function to our app using module.exports
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {

            process.nextTick(function () {

                User.findOne({ 'username': username.toLowerCase() }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false);
                    } else {

                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    passport.use('local-login', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true 
    },
        function (req, username, password, done) { 

            User.findOne({ 'username': username.toLocaleLowerCase() }, function (err, user) {

                if (err)
                    return done(err);

                if (!user)
                    return done(null, false); 

                if (!user.validPassword(password))
                    return done(null, false); 

                return done(null, user);
            });

        }));
};
