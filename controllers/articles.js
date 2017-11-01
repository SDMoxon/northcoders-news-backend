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
exports.getArticlesByTopic = (req, res) => {
    Articles.find({ belongs_to: req.params.topic_id })
        .then(articles => {
            if (!articles.length) {
                console.log(articles);
                return res.status(404).json({ message: 'Articles not found' });
            }
            res.json({
                articles
            });
        }).catch((rej) => {
            rej.status(500);
        });
};

exports.alterVotes = (req, res) => {
    const vote = req.query.vote;
    let change;
    vote === 'up' ?
        change = Articles.findByIdAndUpdate({ _id: req.params.article_id }, { $inc: { votes: 1 } }, { new: true })    
        :
        change = Articles.findByIdAndUpdate({ _id: req.params.article_id }, { $inc: { votes: -1 } }, { new: true });
    change.then((article) => {
        if (!article) { res.status(404).json('Not Found'); }
        res.status(201).json(article);
    })
        .catch((err) => {
            res.status(500).json(err);
        });
};  