var express = require('express');
var UserController = require('./controllers/user');
const checkAuth = require('./middleware/check-auth');
var router = express.Router();
const passport = require('passport');

// Oauth connection
router.get(
    '/auth/google',
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);
router.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    UserController.login
);

module.exports = router;