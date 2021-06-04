const fs = require('fs')
const path = require('path')
const { getUserIndex } = require('./users')

/**
 * Leave action set to 0.
 */
const LEAVE = 0

/**
 * Continue action set to 1.
 */
const CONTINUE = 1

const CARDS_TYPE = {
  "bad": 0,
  "good": 1,
  "bonus": 2
};

/**
 * Star bonus defined as 5 gold.
 */
const STAR_BONUS = 5

/**
 * Default multiplicator for the game.
 */
const DEF_MULT = 0

/**
 * Get all cards from cards.json
 */
const CARDS_JSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/cards.json'))
)

/**
 * Get cards property from cards.
 */
const CARDS = CARDS_JSON.cards

const shuffleDeck = deck => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

/**
 * Class representing the game.
 */
class Game {
  /**
   * Create the game.
   *
   * @param {array} users - list of users
   * @param {object} options - game optionss
   */
  constructor(users, options) {
    this.users = users
    this.gold = 0
    this.stars = []
    this.round = 1
    const _initialisedDeck = this.initDeck()
    this.cards = [..._initialisedDeck]
    this.rawCards = [..._initialisedDeck]
    this.removedCard = null
    this.deck = []
    this.highCards = []
    this.remainingUsers = this.users.length
    this.playedUser = 0
    this.mult = options.mult || DEF_MULT
    // nbRound, nbPlayer, x2Stars, duplicate, mult
    this.options = options

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].left = false
      this.users[i].checked = false
      this.users[i].action = CONTINUE
      this.users[i].gold = 0
      this.users[i].currentGold = 0
    }
  }

  initDeck() {
    const nbGoodToUsed = 15;
    const nbBadToUsed = 5;
    const nbGoodCards = 32;
    const nbBadCards = 16;
    const nbDupCard = 3;
    const nbBonusToUsed = 5;

    const goodCards = Array.from(
      Array(nbGoodCards), (_, index) => index
    );

    const badCards = Array.from(
      Array(nbBadCards), (_, index) => index + nbGoodCards
    );

    shuffleDeck(goodCards);
    shuffleDeck(badCards);

    const goodCardsArray = []
    const badCardsArray = []
    const bonusCardsArray = []

    for(let i = 0; i < nbGoodToUsed; i++)
      goodCardsArray.push(CARDS[goodCards[i]]);

    for(let i = 0; i < nbBadToUsed; i++) {
      const card = CARDS[badCards[i]];
      for(let i = 0; i < nbDupCard; i++) {
        const dupCard = Object.assign(card, { id: card.id + 100 * i })
        badCardsArray.push(dupCard);
      }
    }

    console.log(badCardsArray)

    for(let i = 0; i < nbBonusToUsed; i++)
      bonusCardsArray.push(CARDS[nbGoodCards + nbBadCards + i]);

    return [...goodCardsArray, ...badCardsArray, ...bonusCardsArray]
  }

  /**
   * Count played users and remaining users.
   */
  _countPlayedUsers() {
    let played = 0
    let remaining = 0
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].checked) played++
      if (this.users[i].left !== true) remaining++
    }

    return { played, remaining }
  }

  /**
   * Check if there is a duplicate card.
   *
   * @param {object} card - card
   */
  _hasDuplicates(card) {
    for (let i = 0; i < this.deck.length; i++)
      if (this.deck[i].name === card.name) return true
    return false
  }

  /**
   * Get the remaining user.
   */
  _remainingUser() {
    return this.users.filter((user) => user.left !== true)
  }

  /**
   * Get all leaving users.
   *
   * @param {array} users - user
   */
  _leavingUsers(users) {
    return users.filter((user) => user.action === LEAVE)
  }

  /**
   * Check if all user have played.
   */
  allChecked() {
    return this.playedUser === this.remainingUsers
  }

  /**
   * Initialize the game.
   *
   * @param {array} users - users
   */
  initGame(users) {
    this.users = users
    this.gold = 0
    this.round = 1
    this.cards = [...CARDS]
    this.deck = []
    this.highCards = []

    this.remainingUsers = this.users.length
    this.playedUser = 0

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].left = false
      this.users[i].checked = false
      this.users[i].action = CONTINUE
      this.users[i].gold = 0
      this.users[i].currentGold = 0
      this.users[i].lastGold = -1
    }
  }

  /**
   * Check if the game is over.
   */
  end() {
    return this.round > this.options.nbRound
  }

  /**
   * Get game options.
   */
  getOptions() {
    return this.options
  }

  /**
   * Get game state.
   */
  getGameState() {
    return {
      gold: this.gold,
      round: this.round,
      deck: this.deck,
      nbCards: this.cards.length,
      remainingUsers: this.remainingUsers,
      stars: this.stars,
      highCards: this.highCards
    }
  }

  /**
   * Start a new round.
   */
  newRound() {
    if(this.removedCard) {
      const index = this.rawCards.findIndex((c) => this.removedCard === c.id);
      if(index !== -1)
        this.rawCards.splice(index, 1)
    }

    this.gold = 0
    this.cards = [...this.rawCards]
    this.deck = []
    this.highCards = []
    this.stars = []
    this.remainingUsers = this.users.length
    this.playedUser = 0

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].left = false
      this.users[i].checked = false
      this.users[i].action = CONTINUE
      this.users[i].currentGold = 0
      this.users[i].lastGold = -1
    }
    this.round++
  }

  /**
   * Check if the game has a user.
   */
  hasUser() {
    return this.users.length > 0
  }

  /**
   * Check if there is a remaining user in a round.
   */
  hasRemainingUsers() {
    return this.remainingUsers !== 0
  }

  getUsers() {
    return this.users
  }

  /**
   * Draw a card. Then, check if there is a duplicate card.
   */
  drawCard() {
    let index = Math.floor(Math.random() * (this.cards.length - 1))
    index = index < 0 ? 0 : index
    const card = this.cards[index]

    const dup = card
      ? this.options.duplicate
        ? card.type === CARDS_TYPE["bad"]
        : card.type === CARDS_TYPE["bad"] && this._hasDuplicates(card)
      : false

    if(card.type === CARDS_TYPE["bad"] && !dup)
      this.highCards.push(card)

    this.deck.push(card)
    this.cards.splice(index, 1)

    if (dup) this.removedCard = card.id

    return { card, dup }
  }

  /**
   * Update game, by checking if there is a duplicate card and
   * remaining users. And also, distribute gold with users.
   *
   * @param {object} gparam - game object
   * @param {object} gparam.card - card
   * @param {boolean} gparam.dup - check if there is a duplicate card
   */
  updateGame({ card, dup }) {
    const leavingUsers = this._leavingUsers(this._remainingUser())

    if (leavingUsers.length !== 0) {
      const x2 = this.options.x2Stars
        ? Math.floor(Math.random() * Math.floor(3))
        : 1
      const sharedStar =
        leavingUsers.length === 1 ? this.stars.length * STAR_BONUS * x2 : 0
      let sharedGold = 0

      sharedGold += Math.floor(this.gold / leavingUsers.length)
      this.gold -= sharedGold * leavingUsers.length

      leavingUsers.map((user) => {
        user.left = true
        user.lastGold = user.currentGold
        user.currentGold += sharedGold + sharedStar
        user.gold += user.currentGold
      })

      if (leavingUsers.length === 1 && this.stars.length) {
        for (let i = 0; i < this.stars.length; i++)
          this.stars[i].activate = true
        this.stars = []
      }
    }

    this.remainingUsers -= leavingUsers.length

    if (!this.hasRemainingUsers()) {
      console.log('No remaining player.')
      return true
    }

    if (dup) {
      console.log('Duplicated card. You loose.')
      console.log(this.deck)
      return true
    }

    if (this.cards.length === 0) {
      console.log('No cards to draw.')
      return true
    }

    this.gold +=
      card.type === CARDS_TYPE["good"] ? 
        card.score + this.mult * this.deck.length : 0


    if (card.type === CARDS_TYPE["bonus"]) {
      this.stars.push(card)
      card.activate = false
    }

    let sharedGold = 0
    const remainingUsers = this._remainingUser()

    sharedGold = Math.floor(this.gold / remainingUsers.length)
    this.gold -= sharedGold * remainingUsers.length

    remainingUsers.map((user) => {
      user.lastGold = user.currentGold
      user.currentGold += sharedGold
      user.checked = false
    })

    this.playedUser = 0

    console.log(this.users)
    return false
  }

  checkAllLeaving() {
    for(let u = 0; u < this.users.length; u++) {
      if(this.users[u].action === CONTINUE)
        return false;
    }
    return true;
  }

  /**
   * Rank users by number of gold.
   */
  rankUsers() {
    this.users.sort((u1, u2) => (u1.gold < u2.gold ? 1 : -1))
  }

  /**
   * Update user.
   *
   * @param {string} id - user id
   * @param {number} action - user action
   */
  updateAction(id, action) {
    const index = getUserIndex(this.users, id)
    this.users[index].checked = true
    this.users[index].action = action
    this.playedUser++

    return this.allChecked()
  }

  /**
   * Add user on the game.
   *
   * @param {string} id - user id
   */
  addUser(user) {
    let index = this.users.findIndex((u) => u.id === user.id)

    if (index === -1) {
      this.users.unshift(user)
      index = 0
    }

    this.users[index].left = false
    this.users[index].checked = false
    this.users[index].action = CONTINUE
    this.users[index].gold = 0
    this.users[index].currentGold = 0
    this.users[index].lastGold = -1

    const { played, remaining } = this._countPlayedUsers()
    this.remainingUsers = remaining
    this.playedUser = played
  }

  /**
   * Remove user from the game and update the game.
   *
   * @param {string} id - user id
   */
  removeUser(id) {
    // TODO: useless but to improve
    const index = this.users.findIndex((user) => user.id === id)

    if (index !== -1) this.users.splice(index, 1)

    const { played, remaining } = this._countPlayedUsers()
    this.remainingUsers = remaining
    this.playedUser = played
  }
}

module.exports = Game
