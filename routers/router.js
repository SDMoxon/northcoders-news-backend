const routes = require('express').Router();
const { Topics,
        Articles, 
        Users, 
        // Comments 
        } = require('../controllers');


routes.get('/', (req, res) => {
    res.status(200).send('All good!');
});

routes.get('/topics', Topics.getTopics);
routes.get('/articles', Articles.getArticles);
routes.get('/users/:username', Users.getUser);
routes.get('/topics/:topic_id/articles', Articles.getArticlesByTopic);

module.exports = routes;