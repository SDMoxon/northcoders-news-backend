const { Articles } = require('../models/models');

exports.getArticles = (req, res) => {
    Articles.find()
        .then((articles) => {
            if (!articles.length) {
                return res.status(404).json({ message: 'Articles not found' });
            }
            res.json({
                articles
            });
        }).catch((rej) => {
            rej.status(500);
        });
};