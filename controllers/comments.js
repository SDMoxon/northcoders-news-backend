const { Comments } = require('../models/models');
exports.getCommentsByArticle = (req, res, next) => {
    Comments.find({ belongs_to: req.params.article_id })
        .then((comments) => {
            if (!comments) {
                next(comments);
            }
            res.status(200).json({
                comments
            });
        }).catch((err) => {
            next(err);
        });
};

exports.postNewComment = ((req, res, next) => {
    const comment = new Comments({
        body: req.body.body,
        belongs_to: req.params.article_id
    });
    comment.save()
        .then((comment) => {
            res.status(201).json(comment);
        })
        .catch((err) => {
            next(err);
        });

});

exports.alterVotes = (req, res, next) => {
    const vote = req.query.vote;
    let change;
    vote === 'up' ?
        change = Comments.findByIdAndUpdate({ _id: req.params.comment_id }, { $inc: { votes: 1 } }, { new: true })
        :
        change = Comments.findByIdAndUpdate({ _id: req.params.comment_id }, { $inc: { votes: -1 } }, { new: true });
    change.then((comment) => {
        if (!comment) { next(); }
        res.status(201).json(comment);
    })
        .catch((err) => {
            res.status(500).json(err);
        });
};
exports.deleteComment = (req, res, next) => {
    Comments.findByIdAndRemove({ _id: req.params.comment_id })
        .then((comment) => {
            if (!comment) { next(); }
            res.status(200).send(comment);
        })
        .catch((err) => {
            next(err);
        });
};  