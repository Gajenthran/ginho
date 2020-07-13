const fs = require('fs');

const NB_ROUND = 3;
// const NB_CARDS = 34;
const LEAVE = 0, CONTINUE = 1;
const CARDS_JSON = JSON.parse(fs.readFileSync(`${__dirname}/cards.json`));
const CARDS = CARDS_JSON.cards;

class Game {
  constructor(users) {
    this.users = users;
    this.gold = 0;
    this.star = [];
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
    return this.round > NB_ROUND;
  }

  getGameState() {
    // TODO: remove users values
    return {
      gold: this.gold,
      round: this.round,
      deck: this.deck,
      users: this.users,
      nbCards: this.cards.length,
      remainingUsers: this.remainingUsers
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

  hasRemainingUsers() {
    return this.remainingUsers !== 0;
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

    const dup = card.type === 0 && this._hasDuplicates(card);

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
      let sharedStar = leavingUsers.length === 1 ?
        this.star.length * 5 : 0;
      let sharedGold = 0;

      sharedGold += Math.floor(this.gold / leavingUsers.length);
      this.gold -= sharedGold * leavingUsers.length;

      leavingUsers.map(user => {
        user.left = true;
        user.currentGold += sharedGold + sharedStar;
        user.gold += user.currentGold;
      });

      if (leavingUsers.length === 1) this.star = [];
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
    if (card.name === 'star') this.star.push(card);

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
}

module.exports = Game;