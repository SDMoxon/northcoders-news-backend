const { Articles } = require('../models/models');

exports.getArticles = (req, res, next) => {
    Articles.find()
        .then((articles) => {
            if (!articles.length) {
                next();
            }
            res.json({
                articles
            });
        }).catch((err) => {
            next(err);
        });
};
exports.getArticlesByTopic = (req, res, next) => {
    Articles.find({ belongs_to: req.params.topic_id })
        .then(articles => {
            if (!articles.length) {
                return res.status(404).json({ message: 'Articles not found' });
            }
            res.json({
                articles
            });
        }).catch((err) => {
            next(err);
        });
};

exports.alterVotes = (req, res, next) => {
    const vote = req.query.vote;
    let change;
    vote === 'up' ?
        change = Articles.findByIdAndUpdate({ _id: req.params.article_id }, { $inc: { votes: 1 } }, { new: true })    
        :
        change = Articles.findByIdAndUpdate({ _id: req.params.article_id }, { $inc: { votes: -1 } }, { new: true });
    change.then((article) => {
        if (!article) { next(); }
        res.status(201).json(article);
    })
        .catch((err) => {
            next(err);
        });
};  