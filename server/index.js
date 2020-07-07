const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const url = require('url');
const passport = require('passport');
const socketIO = require('socket.io');

const diamant = require('./core/diamant');

require('dotenv').config();
require('./config/passport-setup');

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());

const server = http.Server(app);
const io = socketIO(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }
});

app.enable('trust proxy');

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

const printPath = (req, res, next) => {
  var path = url.parse(req.url).pathname;
  console.log(path);
  next();
};

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir))
app.use('/api/lobby', printPath, require('./api/lobby'))
app.use('/api/user', printPath, require('./api/user'));

if (ENV === 'production') {
  app.use(express.static(path.join(__dirname, './../client/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, './../client/build/index.html'));
  });
} else {
  console.log('You are in development environment...');
}

io.on('connection', (socket) => {
  listen(io, socket, 'new-player', diamant.addNewPlayer.bind(diamant));
  // listen(socket, 'player-action', game.updatePlayerInput.bind(game));
  listen(io, socket, 'disconnect', diamant.removePlayer.bind(diamant));
});

function listen(io, socket, type, callback) {
  socket.on(type, (data) => {
    callback(io, socket, data)
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

module.exports = app;