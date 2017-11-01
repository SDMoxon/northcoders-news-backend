if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
const routes = require('./routers/router');

mongoose.connect(db, () => {
    console.log('connected to db');
  });

app.get('/', function (req, res) {
    res.status(200).send('All good!');
  });
  
  app.use('/api', routes);
  
  app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
  });
  
  module.exports = app;