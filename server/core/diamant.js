/* var Player = require('./player');
var Snake = require('./snake');
var Item = require('./item');
var World = require('./world');
var Util = require('./global/util'); */

class Diamant {
  constructor() {
    // this.rooms = new Map();
    this.users = new Map();
  }

  getRoomUsers(secretKey) {
    let users = [];
    for (const [key, user] of this.users.entries()) {
      if (user.secretKey === secretKey)
        users.push(user);
    }
    return users;
  }

  duplicateUser(email) {
    for (const [key, user] of this.users.entries()) {
      if (user.email == email)
        return 1;
    }
    return 0;
  }

  addNewPlayer(io, socket, user) {
    if (!this.duplicateUser(user.email)) {
      this.users.set(socket.id, user);
    }
    console.log(this.users);
    socket.join(user.secretKey);
    socket.broadcast
      .to(user.secretKey)
      .emit(
        'message',
        `${user.firstName} a rejoint la partie.`
      );

    io.to(user.secretKey).emit('room-users', {
      secretKey: user.secretKey,
      users: this.getRoomUsers(user.secretKey)
    });
  }

  update() {
    this.updatePlayers();
    this.updateItems();
  }

  updatePlayers() {
    for (let player of this.players.values()) {
      this.world.insertSnakeBody(player);
      player.move(this.world);
      player.collision(this.world);
      this.world.insertSnakeHead(player);
      if (!player.alive)
        this.removePlayer(player.socket);
    }
  }

  updateItems() {
    if (Item.endOfSpawnTime(this.items.length))
      this.addNewItem(Item.chooseRandomItem());
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].use) {
        this.items.splice(i, 1);
      }
    }
  }

  updatePlayerInput(socket, input) {
    if (this.players.has(socket.id)) {
      this.players.get(socket.id).update(input);
    }
  }

  removePlayer(io, socket) {
    if (this.users.has(socket.id)) {
      let user = this.users.get(socket.id);
      this.users.delete(socket.id);
      io.to(user.secretKey).emit('room-users', {
        secretKey: user.secretKey,
        users: this.getRoomUsers(user.secretKey)
      });
    }
  }

  removeAllPlayer() {
    this.players.clear();
  }

  getEnemies(playerSocket) {
    var enemies = new Array();
    for (let enemy of this.players.values())
      if (enemy.socket.id != playerSocket.id)
        enemies.push({
          "body": enemy.body,
          "score": enemy.score,
          "dir": Snake.getDir(enemy.dir),
          "size": enemy.size
        });
    return enemies;
  }

  emitValuesToClient() {
    var data;
    for (let player of this.players.values()) {
      data = {
        "player": {
          "body": player.body,
          "score": player.score,
          "dir": Snake.getDir(player.dir),
          "size": player.size
        },
        "enemies": this.getEnemies(player.socket),
        "items": this.items
      };
      player.socket.emit("update-players", data);
    }
  }
}

module.exports = new Diamant();