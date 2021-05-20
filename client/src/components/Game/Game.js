import React, { useEffect, useState } from 'react'
import { ProgressBar, Spinner } from 'react-bootstrap'

import './Game.css'

import goldImg from './../../assets/img/gold.png'
import starImg from './../../assets/img/star.png'
import blooperImg from './../../assets/img/blooper.png'
import bowserImg from './../../assets/img/bowser.png'
import koopaImg from './../../assets/img/koopa.png'
import piranhaImg from './../../assets/img/piranha.png'
import thwompImg from './../../assets/img/thwomp.png'
import deckImg from './../../assets/img/deck.png'
import blockUsedImg from './../../assets/img/block-used.png'

import fullScreenImg from './../../assets/img/full-screen.png'

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
  fire: { img: blooperImg, name: 'SPINY' },
  water: { img: koopaImg, name: 'KOOPA' },
  wind: { img: piranhaImg, name: 'PIRANHA' },
  earth: { img: thwompImg, name: 'GOOMBA' },
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
  onFullscreen
}) => {
  const [showDraw, setShowDraw] = useState(false)
  const [showDrawnCard, setShowDrawnCard] = useState(null)

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

  useEffect(() => {
    socket.on(
      'game:update-game',
      ({ gameState, isAllLeaving }) => {
        if(!isAllLeaving) {
          setShowDrawnCard(gameState.deck[gameState.deck.length - 1])
          setShowDraw(true)

          setTimeout(() => {
            setShowDraw(false)
            setShowDrawnCard(null)
          }, 1000);
        }
      }
    )
  }, [socket])

  /**
   * Render all users in the game and show the status
   * of each user (white = leaving status, red =
   * must play and green = played) with the number
   * of gold.
   */
  const renderUsers = () => {
    return (
      <div className="div-container div-users--infos">
        {users.map((usr) => (
          <div className="div-users--infos-list" key={usr.id}>
            <div className="div-users--name">
              <img
                className="div-users--name--avatar"
                src={usr.img}
                alt="check-button"
                style={usr.left || usr.checked ? { filter: 'grayscale(1)' } : null}
              />
              {usr.name}
            </div>
            <div className="div-users--gold">
              <img src={goldImg} alt="gold" />
              {usr.id === socket.id ?
                <div> {user.currentGold} <span> ({user.gold}) </span> </div> :
                <div> {usr.currentGold} </div>
              }
            </div>
          </div>
        ))}
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

  const renderCards = (card) => {
    const activatedCard = card.name === 'star' && card.activate

    return (
      <div>
        <img
          src={CARDS_IMG[card.name].img}
          alt={card.name}
          style={activatedCard ? { filter: 'grayscale(1)' } : null}
        />
        {
          card.name === 'gold' && (
            <p className="div-gameboard--card-score">
              {card.score}
            </p>
          )
        }
      </div>
    )
  }

  /**
   * Render the list of drawn cards.
   */
  const renderDeck = () => {
    return (
      <div className="div-container div-gameboard--board">
        {
          (showDraw && showDrawnCard) ? (
            <div id="gameboard--empty-img">
              <img 
                id="gameboard--reveal-img"
                src={CARDS_IMG[showDrawnCard.name].img}
                alt="deck" 
                style={{
                  visibility: "visible",
                  transform: "translate3d(0, -0, 0)"
                }}
              />
              <img 
                id="gameboard--block-img" 
                src={blockUsedImg} 
                alt="deck" 
                style={{
                  animation: "block-pop .25s linear"
                }}
              />
            </div>
          ) : (
            <div id="gameboard--empty-img">
              <img id="gameboard--reveal-img" src={deckImg} alt="deck" />
              <img id="gameboard--block-img" src={deckImg} alt="deck" />
            </div>
          )
        }
        {gameState.deck.slice(0).reverse().map((card) => (
          <div className="div-gameboard--card" key={card.id}>
            {renderCards(card)}
          </div>
        ))}
      </div>
    )
  }

  /**
   * Render the list of drawn cards but highlight duplicate
   * card.
   */
  const renderDeckHighlight = () => {
    const lCard = gameState.deck[gameState.deck.length - 1]
    return (
      <div className="div-container div-gameboard--board">
        {gameState.deck.slice(0).reverse().map((card) => (
          <div
            key={card.id}
            className={
              lCard.type === 0 &&
                lCard.name === card.name ?
                'div-gameboard--card' :
                'div-gameboard--card card-transparent'
            }
          >
            {renderCards(card)}
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
    <div id="game-container-id" className="div-game-container">
      <img 
        className="game-full-screen" 
        src={fullScreenImg}
        onClick={onFullscreen}
        alt="full-screen"
      />
      <div className="div-game">
        <div className="div-game--layout">
          <div className="div-gameboard--layout">
            {renderInfos()}
            <div className="div-container div-gameboard--board">
              {dupCard ? renderDeckHighlight() : renderDeck()}
            </div>
          </div>
          <div id="div-users--container">
            {renderUsers()}
            {renderUserAction()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game
