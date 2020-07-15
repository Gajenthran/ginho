var Game = require('./game');
var {
  hasUser,
  getUserIndex,
  getUsersInRoom,
  getUser
} = require('./users');

/**
 * Class representing the ginho engine.
 */
class Ginho {
  /**
   * Create ginho engine.
   */
  constructor() {
    this.users = [];
    this.game = new Map();
  }

  /**
   * Launch the game, by getting users in the room,
   * initialize game state, and game options from the lobby.
   * 
   * @param {object} io - io 
   * @param {object} socket - socket io
   * @param {object} options - game options
   */
  startGame(io, socket, options) {
    const user = getUser(this.users, socket.id);

    if (!user)
      return { error: `Cannot connect with user.` }

    const users = getUsersInRoom(this.users, user.room);

    this.game.set(user.room, new Game(users, options));
    const game = this.game.get(user.room);

    if (!game)
      return { error: 'Game don\'t exist.' }

    const gameState = game.getGameState(user);
    io
      .to(user.room)
      .emit('new-game', { gameState, options, room: user.room });
  }

  /**
   * Launch the game, by getting users in the room and
   * initialize game state.
   * 
   * @param {object} io - io 
   * @param {object} socket - socket io
   * @param {object} options - game options
   */
  restartGame(io, socket) {
    const user = getUser(this.users, socket.id);

    if (!user)
      return { error: `Cannot connect with user.` }

    const users = getUsersInRoom(this.users, user.room);

    const game = this.game.get(user.room);

    if (!game)
      return { error: 'Game don\'t exist.' }

    game.initGame(users);
    const gameState = game.getGameState(user);

    io
      .to(user.room)
      .emit('new-game', {
        gameState,
        options: game.getOptions(),
        room: user.room
      });
  }

  /**
   * Add user in a room. If there is no room with 
   * this name, create it.
   * 
   * @param {object} io - io 
   * @param {object} socket - socket io
   * @param {object} user - user details  
   * @param {string} user.name - username
   * @param {string} user.email - user email
   * @param {string} user.room - user room
   */
  addUser(io, socket, { name, email, room }) {
    if (!name || !room)
      return { error: 'Username and room are required.' };

    if (hasUser(this.users, name, room))
      return { error: 'Username is taken.' };

    const user = { id: socket.id, name, email, room };
    this.users.push(user);

    let gameStarted = false,
      gameState = null,
      gameOptions = null;

    const game = this.game.get(room);

    if (game) {
      gameStarted = game.addUser(user.id);
      gameState = game.getGameState(user);
      gameOptions = game.getOptions();
    }

    socket.join(user.room);

    io
      .to(user.room)
      .emit('room-users', {
        room: user.room,
        users: getUsersInRoom(this.users, user.room),
        gameStarted,
        gameState,
        gameOptions
      });
  }

  /**
   * Remove user from the lobby or the game.
   * 
   * @param {object} io - io 
   * @param {object} socket - socket io
   */
  removeUser(io, socket) {
    const index = this.users.findIndex((user) => user.id == socket.id);

    if (index === -1)
      return { error: 'No player to remove.' };

    const user = this.users.splice(index, 1)[0];
    const game = this.game.get(user.room);

    if (!game)
      return { error: 'Game don\'t exist.' }

    if (user) {
      console.log(`removeUser: ${user.id} - ${user.name}`);
      game.removeUser(user.id);

      if (game.hasUser()) {
        this.updateGame(io, game, user, game._allChecked());
        this.endGame(io, game, user);
      } else {
        this.game.delete(user.room);
      }

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

  /**
   * Update user action.
   * 
   * @param {object} io - io 
   * @param {object} socket - socket io
   * @param {*} action - user action 
   */
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

    var gameState = game.getGameState(user);
    this.users = gameState.users;
    gameState.allChecked = allChecked;

    io
      .to(user.room)
      .emit('update-users-action', { gameState, room: user.room });

    this.updateGame(io, game, user, allChecked)
    this.endGame(io, game, user);

    return { gameState };
  }

  /**
   * Update game.
   * 
   * @param {object} io - io 
   * @param {object} game - game object
   * @param {object} user - user 
   * @param {boolean} allChecked - check if all user have played
   */
  updateGame(io, game, user, allChecked) {
    if (allChecked) {
      const { card, dup } = game.drawCard();
      const newRound = game.updateGame({ card, dup });
      let gameState = game.getGameState(user);
      gameState.newRound = newRound;

      io
        .to(user.room)
        .emit('update-game', {
          noRemainingUser: newRound && !game.hasRemainingUsers(),
          dupCard: dup,
          gameState
        });

      if (newRound) {
        game.newRound();
        gameState = game.getGameState(user);

        io
          .to(user.room)
          .emit('new-round', { gameState, room: user.room });
      }
    }
  }

  /**
   * Check if it is the end of the game. If it
   * is the case, rank users.
   * 
   * @param {object} io - io 
   * @param {*} game - game engine
   * @param {*} user - user
   */
  endGame(io, game, user) {
    if (game.end()) {
      game.rankUsers();
      let gameState = game.getGameState(user);

      io
        .to(user.room)
        .emit('end-game', { gameState, room: user.room });
    }
  }
}


module.exports = new Ginho();