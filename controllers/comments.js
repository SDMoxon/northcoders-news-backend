const { Comments } = require('../models/models');
exports.getCommentsByArticle = (req, res) => {
    Comments.find({belongs_to : req.params.article_id})
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