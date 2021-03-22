import React from 'react'
import { ProgressBar, Spinner } from 'react-bootstrap'

import './Game.css'

import goldImg from './../../assets/img/gold.png'
import starImg from './../../assets/img/star.png'
import greenButtonImg from './../../assets/img/greenbutton.png'
import redButtonImg from './../../assets/img/redbutton.png'
import whiteButtonImg from './../../assets/img/whitebutton.png'
import blooperImg from './../../assets/img/blooper.png'
import bowserImg from './../../assets/img/bowser.png'
import koopaImg from './../../assets/img/koopa.png'
import piranhaImg from './../../assets/img/piranha.png'
import thwompImg from './../../assets/img/thwomp.png'
import deckImg from './../../assets/img/deck.png'

/**
 * Leave action set to 0.
 */
const LEAVE = 0

/**
 * Continue action set to 1.
 */
const CONTINUE = 1

/**
 * All card images of the game with their label.
 */
const CARDS_IMG = {
  gold: { img: goldImg, name: 'PIÈCES' },
  star: { img: starImg, name: 'ÉTOILES' },
  fire: { img: blooperImg, name: 'BLOOPER' },
  water: { img: koopaImg, name: 'KOOPA' },
  wind: { img: piranhaImg, name: 'PIRANHA' },
  earth: { img: thwompImg, name: 'THWOMP' },
  space: { img: bowserImg, name: 'BOWSER' },
}

/**
 * Game component to play Ginho. A game is divided into
 * several rounds. In each round, users must indicates if
 * they decide to continue or not.
 *
 * @param {object} gparam - game details
 * @param {object} gparam.socket - socket io
 * @param {object} gparam.user - user
 * @param {array} gparam.users - other users
 * @param {object} gparam.gameState - game state
 * @param {boolean} gparam.dupCard - check duplicate card in the deck.
 * @param {boolean} gparam.hasRemainingUser - check remaining user to play
 * @param {number} gparam.nbRound - game round
 */
const Game = ({
  socket,
  user,
  users,
  gameState,
  dupCard,
  hasRemainingUser,
  nbRound,
}) => {
  /**
   * Handle user action (either continue the
   * round, or exit). Then, emit the user action
   * to the server.
   *
   * @param {object} event - event
   * @param {number} action - action (leaving or continue)
   */
  const onAction = (event, action) => {
    event.preventDefault()
    socket.emit('game:update-action', { action })
  }

  /**
   * Render all users in the game and show the status
   * of each user (white = leaving status, red =
   * must play and green = played) with the number
   * of gold.
   */
  const renderUsers = () => {
    return (
      <div className="div-container div-users--infos">
        <div className="div-users--infos-list" key={socket.id}>
          <div className="div-users--name">
            <img
              src={
                user.left
                  ? whiteButtonImg
                  : user.checked
                    ? greenButtonImg
                    : redButtonImg
              }
              alt="green-button"
            />
            {user.name}
          </div>
          <div className="div-users--gold">
            <img src={goldImg} alt="gold" />
            <div>
              {' '}
              {user.currentGold} <span> ({user.gold}) </span>
            </div>
          </div>
        </div>
        {users.map(
          (usr) =>
            usr.id !== socket.id && (
              <div className="div-users--infos-list" key={usr.id}>
                <div className="div-users--name">
                  <img
                    src={
                      usr.left
                        ? whiteButtonImg
                        : usr.checked
                          ? greenButtonImg
                          : redButtonImg
                    }
                    alt="check-button"
                  />
                  {usr.name}
                </div>
                <div className="div-users--gold">
                  <img src={goldImg} alt="gold" />
                  <div> {usr.currentGold} </div>
                </div>
              </div>
            )
        )}
        {(dupCard || !hasRemainingUser) && (
          <Spinner
            className="users-spinner--loading"
            animation="border"
            role="status"
          />
        )}
      </div>
    )
  }

  /**
   * Render the list of drawn cards.
   */
  const renderDeck = () => {
    return (
      <div className="div-container div-gameboard--board">
        {gameState.deck.map((card, index) => (
          <div className="div-gameboard--card" key={card.id}>
            <div>
              {card.name === 'gold' ? (
                <>
                  <img src={CARDS_IMG[card.name].img} alt="gold" />
                  <div className="div-gameboard--card-gold">
                    {' '}
                    {card.score}
                    <span> {CARDS_IMG[card.name].name} </span>
                  </div>
                </>
              ) : card.name === 'trap' ? (
                <>
                  <img src={CARDS_IMG[card.element].img} alt="trap" />
                  <div className="div-gameboard--card-trap">
                    {CARDS_IMG[card.element].name}
                  </div>
                </>
              ) : card.name === 'star' ? (
                <>
                  <img
                    src={CARDS_IMG[card.name].img}
                    alt="star"
                    style={card.activate ? { filter: 'grayscale(1)' } : null}
                  />
                  <div className="div-gameboard--card-star">
                    {CARDS_IMG[card.name].name}
                  </div>
                </>
              ) : (
                'Problem with database.'
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  /**
   * Render the list of drawn cards but highlight duplicate
   * card.
   */
  const renderDeckHidden = () => {
    const lCard = gameState.deck[gameState.deck.length - 1]
    return (
      <div className="div-container div-gameboard--board">
        {gameState.deck.map((card) => (
          <div
            className={
              lCard.name === 'trap' &&
                lCard.name === card.name &&
                lCard.element === card.element
                ? 'div-gameboard--card'
                : 'div-gameboard--card card-transparent'
            }
            key={card.id}
          >
            <div>
              {lCard.name === 'trap' &&
                lCard.name === card.name &&
                lCard.element === card.element ? (
                <>
                  <img src={CARDS_IMG[card.element].img} alt="trap" />
                  <div className="div-gameboard--card-trap">
                    {CARDS_IMG[card.element].name}
                  </div>
                </>
              ) : card.name === 'gold' ? (
                <>
                  <img src={CARDS_IMG[card.name].img} alt="gold" />
                  <div className="div-gameboard--card-gold">
                    {' '}
                    {card.score}
                    <span> {CARDS_IMG[card.name].name} </span>
                  </div>
                </>
              ) : card.name === 'trap' ? (
                <>
                  <img src={CARDS_IMG[card.element].img} alt="gold" />
                  <div className="div-gameboard--card-trap">
                    {CARDS_IMG[card.element].name}
                  </div>
                </>
              ) : card.name === 'star' ? (
                <>
                  <img src={CARDS_IMG[card.name].img} alt="gold" />
                  <div className="div-gameboard--card-star">
                    {CARDS_IMG[card.name].name}
                  </div>
                </>
              ) : (
                'Problem with database.'
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  /**
   * Render game informations: treasure, remaining
   * rounds and remaining cards.
   */
  const renderInfos = () => {
    return (
      <div className="div-container div-gameboard--infos">
        <div className="div-gameboard-icons">
          <img className="game--icons" src={goldImg} alt="gold" />
          <div> {gameState.gold} </div>
        </div>
        <div className="div-gameboard-icons div-gameboard-deck">
          <img className="game--icons" src={deckImg} alt="deck" />
          <div>
            {gameState.deck.length}
            <span> ({gameState.nbCards}) </span>
          </div>
        </div>
        <div className="div-gameboard--progress">
          <ProgressBar now={(gameState.round / nbRound) * 100} />
        </div>
      </div>
    )
  }

  /**
   * Render user action.
   */
  const renderUserAction = () => {
    return (
      <div className="div-users--action">
        {!user.checked ? (
          <>
            <div
              onClick={(e) => onAction(e, CONTINUE)}
              className="div-container div-users--continue"
            >
              <i className="fas fa-gavel"></i>
            </div>
            <div
              onClick={(e) => onAction(e, LEAVE)}
              className="div-container div-users--leave"
            >
              <i className="fas fa-walking"></i>
            </div>
          </>
        ) : null}
      </div>
    )
  }

  return (
    <div className="div-game">
      <div className="div-game--layout">
        <div className="div-gameboard--layout">
          {renderInfos()}
          <div className="div-container div-gameboard--board">
            {dupCard ? renderDeckHidden() : renderDeck()}
          </div>
        </div>
        <div id="div-users--container">
          {renderUsers()}
          {renderUserAction()}
        </div>
      </div>
    </div>
  )
}

export default Game
