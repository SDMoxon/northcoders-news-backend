const routes = require('express').Router();
const { Topics
        // Articles, 
        // Users, 
        // Comments 
        } = require('../controllers');


routes.get('/', (req, res) => {
    res.status(200).send('All good!');
});

routes.get('/topics', Topics.getTopics);

module.exports = routes;