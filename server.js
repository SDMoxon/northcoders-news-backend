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
const { isLoggedIn } = require('./utils');
const morgan = require('morgan');
require('./passport')(passport);

mongoose.connect(db, () => {
    console.log('connected to db');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
});

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());

// required for passport
app.use(require('express-session')({ secret: 'Keyboard cat' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


app.use(cors());

app.get('/', function (req, res) {
    res.status(200).send('All good!');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send({
        username: req.user.username
    });
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
    res.status(500).send('Error 500');
});
/* eslint-enable */

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});

module.exports = app;

