var express = require('express');
var LobbyController = require('./controllers/lobby');
const checkAuth = require('./middleware/check-auth');
var router = express.Router();

router.post('/create', checkAuth, LobbyController.create);
router.post('/join', checkAuth, LobbyController.join);

module.exports = router;