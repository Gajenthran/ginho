var Game = require('./game');

class Diamant {
  constructor() {
    this.users = [];
    this.game = null;
  }

  _hasUser(name, room) {
    // TODO: change username to email !!
    return this.users.find(
      (user) =>
        user.room == room &&
        user.name == name
    );
  }

  _getUserIndex(id) {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].id === id)
        return i;
    return -1;
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
    const user = this._getUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    this.game = null;
    this.game = new Game(this.users);
    this.game.drawCard();
    const gameState = this.game.getGameState();
    this.users = gameState.users;

    io
      .to(user.room)
      .emit('new-game', { gameState, room: user.room });
  }


  restartGame(io, socket) {
    const user = this._getUser(socket.id);

    this.game.initGame(this.users);
    this.game.drawCard();
    const gameState = this.game.getGameState();
    this.users = gameState.users;

    console.log(gameState);

    io
      .to(user.room)
      .emit('new-game', { gameState, room: user.room });
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

  updateUser(io, socket, { action }) {
    if (!(
      typeof action === 'number' &&
      (action === 1 || action === 0)
    )) {
      console.log('It is not an appropriate action.');
      return { error: 'It is not an appropriate action.' };
    }

    const index = this._getUserIndex(socket.id);
    const user = this.users[index];

    if (user && user.checked) {
      console.log('You can\'t two times in the same round.');
      return { error: 'You can\'t two times in the same round.' };
    }

    if (!this.game && this.game === null) {
      console.log('Game is not existing.');
      return { error: 'Game is not existing.' };
    }

    const allChecked = this.game.updateUser(socket.id, action);
    // console.log(this.users);

    var gameState = this.game.getGameState();
    this.users = gameState.users;
    gameState.allChecked = allChecked;

    io
      .to(user.room)
      .emit('update-users-action', { gameState, room: user.room });

    if (allChecked) {
      const { card, dup } = this.game.drawCard();
      const newRound = this.game.updateGame({ card, dup });
      gameState = this.game.getGameState();
      gameState.newRound = newRound;

      io
        .to(user.room)
        .emit('update-game', { gameState, room: user.room });

      if (newRound) {
        this.game._newRound();
        gameState = this.game.getGameState();

        io
          .to(user.room)
          .emit('new-round', { gameState, room: user.room });
      }
    }

    if (this.game.end()) {
      this.game.rankUsers();
      gameState = this.game.getGameState();

      io
        .to(user.room)
        .emit('end-game', { gameState, room: user.room });
    }

    return { gameState };
  }

  // TODO: clear all users in the lobby
  removeAllUser() {
    this.users = [];
  }
}

module.exports = new Diamant();