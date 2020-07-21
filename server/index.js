const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIO = require('socket.io');

const ginho = require('./core/ginho');

require('dotenv').config();

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());

const server = http.createServer(app);
var io = socketIO(server);
io.sockets.server.engine.pingTimeout = 15000;

app.enable('trust proxy');

app.use(cors());

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

if (ENV === 'production') {
  app.use(express.static(path.join(__dirname, './../client/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, './../client/build/index.html'));
  });
} else {
  console.log('You are in development environment...');
}

io.on('connection', (socket) => {
  listen(io, socket, 'join', ginho.addUser.bind(ginho));
  listen(io, socket, 'start-game', ginho.startGame.bind(ginho));
  listen(io, socket, 'update-user', ginho.updateUser.bind(ginho));
  listen(io, socket, 'restart-game', ginho.restartGame.bind(ginho));
  listen(io, socket, 'disconnect', ginho.removeUser.bind(ginho));
});

function listen(io, socket, type, callback) {
  // console.log(`/${type}`);
  socket.on(type, (data) => {
    callback(io, socket, data);
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

module.exports = app;