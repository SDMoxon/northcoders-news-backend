const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bodyParser = require('body-parser');
const config = require('./config');
const db = process.env.NODE_ENV === 'test' ? config.DB.test : config.DB.dev;
const PORT = config.PORT[process.env.NODE_ENV] || 3000;
const routes = require('./routers/router');
const cors = require('cors');

mongoose.connect(db, () => {
    console.log('connected to db');
});

app.use(cors());

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.status(200).send('All good!');
});

app.use('/api', routes);

app.use(function (req, res, next) {
    res.status(404).send('file not found');
});

app.use(function (err, req, res, next) {
    res.send('server encountered an error');
});


app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});

module.exports = app;