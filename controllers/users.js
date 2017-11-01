const { Users } = require('../models/models');
exports.getUser = (req, res) => {
    Users.find()
        .then((users) => {
            return users.filter((user) => {
                return user.username === req.params.username;
            });
        })
        .then((users) => {
            if (!users.length) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                users
            });
        }).catch(() => {
            res.status(500);
        });
};