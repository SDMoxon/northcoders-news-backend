const { Users } = require('../models/models');
exports.getUser = (req, res) => {
    Users.findOne({ 'username': req.params.username })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                user
            });
        }).catch(() => {
            res.status(500);
        });
};