const { Topics } = require('../models/models');

exports.getTopics = (req,res) => {
    Topics.find()
        .then((topics) => {
            if (!topics) {
                return resizeBy.status(404).json({ message: 'Topic not found' });
            }
            res.json({
                topics
            });
        }).catch((rej) => {
            rej.status(500);
        });
};