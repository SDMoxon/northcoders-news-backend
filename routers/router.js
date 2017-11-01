const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.status(200).send('All good!');
});

module.exports = routes;