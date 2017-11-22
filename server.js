const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bodyParser = require('body-parser');
const config = require('./config');
const db = process.env.NODE_ENV === 'test' ? config.DB.test : config.DB.dev;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT || config.PORT.dev;
const routes = require('./routers/router');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('./config.passport')(passport);

mongoose.connect(db, () => {
    console.log('connected to db');
});


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'mySecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(cors());

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.status(200).send('All good!');
});


// process the login form
app.post('/login', function (req, res, next) {
     /* eslint-disable */
    passport.authenticate('local-login', (err, user, info) => {
     /* eslint-enable */
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).send({
                successful: false,
                message: 'Username or password did not match'
            });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).send({
                successful: true,
                user: user
            });
        });
    })(req, res, next);
});


// process the signup form
app.post('/signup', function (req, res, next) {
    /* eslint-disable */
    passport.authenticate('local-signup', function (err, user, info) {
    /* eslint-enable */
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).send(
                {
                    successful: false,
                    message: 'username already taken'
                }
            );
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).send({ successful: true });
        });
    })(req, res, next);
});

app.get('/logout', function (req) {
    req.logout();
});


process.env.NODE_ENV === 'test' ? app.use('/api', routes) : app.use('/api', isLoggedIn, routes);

/*eslint-disable */
app.use(function (req, res, next) {
    res.status(404).send('Error 404');
});

app.use(function (err, req, res, next) {
    res.send('server encountered an error');
});
/* eslint-enable */

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});

module.exports = app;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        // if they aren't redirect them to the home page
        res.status(401).send({ Error: 401 });
    }
}