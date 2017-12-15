// route middleware to make sure a user is logged in
module.exports = {
    isLoggedIn: function (req, res, next) {
        // if user is authenticated in the session, carry on
        console.log('authenticate', req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            // if they aren't send 401
            return res.status(401).send({ Error: 401 });
        }

    }
};