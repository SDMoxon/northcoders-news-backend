const { Topics } = require('../models/models');

exports.getTopics = (req, res, next) => {
    Topics.find()
        .then((topics) => {
            if (!topics) {
                next();
            }
            res.json({
                topics
            });
        }).catch((err) => {
            next(err);
        });
};