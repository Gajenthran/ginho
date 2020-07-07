/* var Player = require('./player');
var Snake = require('./snake');
var Item = require('./item');
var World = require('./world');
var Util = require('./global/util'); */

const { Socket } = require("socket.io-client");

class Diamant {
  constructor() {
    this.users = [];
    // this.startGame = false;
  }

  _hasUser(name, room) {
    // TODO: change username to email !!
    return this.users.find(
      (user) =>
        user.room == room &&
        user.name == name
    );
  }

  _getUsersInRoom(room) {
    return this.users.filter(
      (user) => user.room === room
    );
  }

  _getUser(id) {
    return this.users.find(
      (user) =>
        user.id === id
    );
  }

  startGame(io, socket) {
    console.log('startGame');

    // this.startGame = true;

    console.log(socket.id);
    console.log(this.users);
    const user = this._getUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    socket.broadcast
      .to(user.room)
      .emit('new-game', { room: user.room, users: this._getUsersInRoom(user.room) });
  }

  sendMessage(io, socket, message) {
    const user = this._getUser(socket.id);

    io
      .to(user.room)
      .emit('message', { user: user.name, text: message });
  }

  addUser(io, socket, { name, email, room }) {
    if (!name || !room)
      return { error: 'Username and room are required.' };

    if (this._hasUser(name, room))
      return { error: 'Username is taken.' };

    const user = { id: socket.id, name, email, room };

    this.users.push(user);

    socket.join(user.room);

    socket.emit(
      'message',
      { user: 'admin', text: `Welcome ${user.name}.` }
    );

    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io
      .to(user.room)
      .emit('room-users', { room: user.room, users: this._getUsersInRoom(user.room) });
  }

  removeUser(io, socket) {
    const index = this.users.findIndex((user) => user.id == socket.id);

    if (index === -1)
      return { error: 'No player to remove.' };

    const user = this.users.splice(index, 1)[0];

    if (user) {
      console.log(`removeUser: ${user.id} - ${user.name}`);
      io
        .to(user.room)
        .emit('message', { user: 'Admin', text: `${user.name} has left.` });

      io
        .to(user.room)
        .emit('room-users', { room: user.room, users: this._getUsersInRoom(user.room) });
    }
  }

  // TODO: clear all users in the lobby
  removeAllUser() {
    this.users = [];
  }
}

module.exports = new Diamant();