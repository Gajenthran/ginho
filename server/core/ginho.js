var Game = require('./game');
var {
  hasUser,
  getUserIndex,
  getUsersInRoom,
  getUser
} = require('./users');

class Ginho {
  constructor() {
    this.users = [];
    this.game = new Map();
  }

  startGame(io, socket, options) {
    const user = getUser(this.users, socket.id);

    if (!user)
      return { error: `Cannot connect with user.` }

    const users = getUsersInRoom(this.users, user.room);

    this.game.set(user.room, new Game(users, options));
    const game = this.game.get(user.room);

    if (!game)
      return { error: 'Game don\'t exist.' }

    const gameState = game.getGameState();

    io
      .to(user.room)
      .emit('new-game', { gameState, options, room: user.room });
  }


  restartGame(io, socket) {
    const user = getUser(this.users, socket.id);

    if (!user)
      return { error: `Cannot connect with user.` }

    const users = getUsersInRoom(this.users, user.room);

    const game = this.game.get(user.room);

    if (!game)
      return { error: 'Game don\'t exist.' }

    game.initGame(users);
    const gameState = game.getGameState();

    io
      .to(user.room)
      .emit('new-game', { gameState, options: game.getOptions(), room: user.room });
  }

  addUser(io, socket, { name, email, room }) {
    if (!name || !room)
      return { error: 'Username and room are required.' };

    if (hasUser(this.users, name, room))
      return { error: 'Username is taken.' };

    const user = { id: socket.id, name, email, room };
    this.users.push(user);

    socket.join(user.room);

    io
      .to(user.room)
      .emit('room-users', {
        room: user.room,
        users: getUsersInRoom(this.users, user.room)
      });
  }

  removeUser(io, socket) {
    const index = this.users.findIndex((user) => user.id == socket.id);

    if (index === -1)
      return { error: 'No player to remove.' };

    const user = this.users.splice(index, 1)[0];
    const game = this.game.get(user.room);

    if (!game)
      return { error: 'Game don\'t exist.' }

    game.removeUser(user.id);

    if (user) {
      console.log(`removeUser: ${user.id} - ${user.name}`);

      io
        .to(user.room)
        .emit('room-users', {
          room: user.room,
          users: getUsersInRoom(this.users, user.room)
        });
    }
  }

  // TODO: clear all users in the lobby
  removeAllUser() {
    this.users = [];
  }

  updateUser(io, socket, { action }) {
    if (!(
      typeof action === 'number' &&
      (action === 1 || action === 0)
    )) {
      console.log('It is not an appropriate action.');
      return { error: 'It is not an appropriate action.' };
    }

    const index = getUserIndex(this.users, socket.id);
    const user = this.users[index];

    if (!user) {
      return { error: 'User don\'t exist.' };
    } else {
      if (user.checked) {
        console.log('You can\'t two times in the same round.');
        return { error: 'You can\'t two times in the same round.' }
      }
    }

    const game = this.game.get(user.room);

    if (!game || game === null) {
      console.log('Game is not existing.');
      return { error: 'Game is not existing.' };
    }

    const allChecked = game.updateUser(socket.id, action);

    var gameState = game.getGameState();
    this.users = gameState.users;
    gameState.allChecked = allChecked;

    io
      .to(user.room)
      .emit('update-users-action', { gameState, room: user.room });

    if (allChecked) {
      const { card, dup } = game.drawCard();
      const newRound = game.updateGame({ card, dup });
      gameState = game.getGameState();
      gameState.newRound = newRound;

      io
        .to(user.room)
        .emit('update-game', {
          noRemainingUser: newRound && !game.hasRemainingUsers(),
          dupCard: dup,
          gameState,
        });

      if (newRound) {
        game.newRound();
        gameState = game.getGameState();

        io
          .to(user.room)
          .emit('new-round', { gameState, room: user.room });
      }
    }

    if (game.end()) {
      game.rankUsers();
      gameState = game.getGameState();

      io
        .to(user.room)
        .emit('end-game', { gameState, room: user.room });
    }

    return { gameState };
  }
}

module.exports = new Ginho();