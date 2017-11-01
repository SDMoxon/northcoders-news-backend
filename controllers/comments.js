const { Comments } = require('../models/models');
exports.getCommentsByArticle = (req, res) => {
    Comments.find({ belongs_to: req.params.article_id })
        .then((comments) => {
            if (!comments) {
                return resizeBy.status(404).json({ message: 'Article not found' });
            }
            res.json({
                comments
            });
        }).catch((rej) => {
            rej.status(500);
        });
};

exports.postNewComment = ((req, res) => {
    const comment = new Comments({
        body: req.body.body,
        belongs_to: req.params.article_id
    });
    comment.save()
        .then((comment) => {
            res.status(201).json(comment);
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });

});