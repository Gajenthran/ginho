const fs = require('fs');

const LEAVE = 0, CONTINUE = 1;
const STAR_BONUS = 5;
const CARDS_JSON = JSON.parse(fs.readFileSync(`${__dirname}/cards.json`));
const CARDS = CARDS_JSON.cards;

class Game {
  constructor(users, options) {
    this.users = users;
    this.gold = 0;
    this.stars = [];
    this.round = 1;
    this.cards = [...CARDS];
    this.deck = [];
    this.remainingUsers = this.users.length;
    this.playedUser = 0;
    this.options = options;
    // nbRound, nbPlayer, x2Stars, duplicate

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].left = false;
      this.users[i].checked = false;
      this.users[i].action = CONTINUE;
      this.users[i].gold = 0;
      this.users[i].currentGold = 0;
    }
  }

  initGame(users) {
    this.users = users;
    this.gold = 0;
    this.round = 1;
    this.cards = [...CARDS];
    this.deck = [];
    this.remainingUsers = this.users.length;
    this.playedUser = 0;

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].left = false;
      this.users[i].checked = false;
      this.users[i].action = CONTINUE;
      this.users[i].gold = 0;
      this.users[i].currentGold = 0;
    }
  }

  end() {
    return this.round > this.options.nbRound;
  }

  getOptions() { return this.options }

  getGameState() {
    // TODO: remove users values
    return {
      gold: this.gold,
      round: this.round,
      deck: this.deck,
      users: this.users,
      nbCards: this.cards.length,
      remainingUsers: this.remainingUsers,
      stars: this.stars
    };
  }

  newRound() {
    this.gold = 0;
    this.cards = [...CARDS];
    this.deck = [];
    this.remainingUsers = this.users.length;
    this.playedUser = 0;

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].left = false;
      this.users[i].checked = false;
      this.users[i].action = CONTINUE;
      this.users[i].currentGold = 0;
    }
    this.round++
  }

  _getUser(id) {
    return this.users.find(
      (user) =>
        user.id === id
    );
  }

  hasUser() {
    return this.users.length > 0;
  }

  hasRemainingUsers() {
    return this.remainingUsers !== 0;
  }

  _countPlayedUsers() {
    var played = 0, remaining = 0;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].checked)
        played++;
      if (this.users[i].left !== true)
        remaining++;
    }

    return { played, remaining };
  }

  _getUserIndex(id) {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].id === id)
        return i;
    return -1;
  }

  _hasDuplicates(card) {
    for (let i = 0; i < this.deck.length; i++)
      if (this.deck[i].element === card.element)
        return true;
    return false;
  }

  _remainingUser() {
    return this.users.filter(
      (user) => user.left !== true
    );
  }

  _allChecked() {
    return this.playedUser === this.remainingUsers;
  }

  drawCard() {
    var index = Math.floor(Math.random() * (this.cards.length - 1));
    index = index < 0 ? 0 : index;
    const card = this.cards[index];

    const dup = this.options.duplicate ?
      card.type === 0 : card.type === 0 && this._hasDuplicates(card);

    this.deck.push(card);
    this.cards.splice(index, 1);

    return { card, dup };
  }

  _leavingUsers(users) {
    return users.filter(
      (user) => user.action === LEAVE
    );
  }

  updateGame({ card, dup }) {
    let leavingUsers = this._leavingUsers(this._remainingUser());

    if (leavingUsers.length !== 0) {
      const x2 = this.options.x2Stars ?
        Math.floor(Math.random() * Math.floor(3)) :
        1;
      let sharedStar = leavingUsers.length === 1 ?
        this.stars.length * STAR_BONUS * x2 : 0;
      let sharedGold = 0;

      sharedGold += Math.floor(this.gold / leavingUsers.length);
      this.gold -= sharedGold * leavingUsers.length;

      leavingUsers.map(user => {
        user.left = true;
        user.currentGold += sharedGold + sharedStar;
        user.gold += user.currentGold;
      });

      if (
        leavingUsers.length === 1 &&
        this.stars.length
      ) {
        for (let i = 0; i < this.stars.length; i++)
          this.stars[i].activate = true;
        this.stars = [];
      }
    }

    this.remainingUsers -= leavingUsers.length;

    if (!this.hasRemainingUsers()) {
      console.log('No remaining player.')
      return true;
    }

    if (dup) {
      console.log('Duplicated card. You loose.');
      return true;
    }

    this.gold += card.name === 'gold' ? card.score : 0;
    if (card.name === 'star') {
      this.stars.push(card);
      card.activate = false;
    }

    // TODO: better iteration
    let sharedGold = 0;
    let remainingUsers = this._remainingUser();

    sharedGold = Math.floor(this.gold / remainingUsers.length);
    this.gold -= sharedGold * remainingUsers.length;

    remainingUsers.map(user => {
      user.currentGold += sharedGold;
      user.checked = false;
    });

    this.playedUser = 0;

    return false;
  }

  rankUsers() {
    this.users.sort((u1, u2) => u1.gold < u2.gold ? 1 : -1);
  }

  updateUser(id, action) {
    const index = this._getUserIndex(id);
    this.users[index].checked = true;
    this.users[index].action = action;
    this.playedUser++;

    return this._allChecked();
  }

  addUser(id) {
    const index = this.users.findIndex((user) => user.id == id);

    if (index !== -1) {
      this.users[index].left = false;
      this.users[index].checked = false;
      this.users[index].action = CONTINUE;
      this.users[index].gold = 0;
      this.users[index].currentGold = 0;
    }

    const { played, remaining } = this._countPlayedUsers()
    this.remainingUsers = remaining;
    this.playedUser = played;
    return index !== -1;
  }

  removeUser(id) {
    // TODO: useless but to improve
    const index = this.users.findIndex((user) => user.id == id);

    if (index !== -1)
      this.users.splice(index, 1)[0];

    const { played, remaining } = this._countPlayedUsers()
    this.remainingUsers = remaining;
    this.playedUser = played;
  }
}

module.exports = Game;