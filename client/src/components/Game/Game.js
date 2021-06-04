import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';

import './Game.css'

import { IMGS } from './../constants/images';
import {
  USERS_POS,
  ANIM_FLIP
} from './../constants/css'

/**
 * Leave action set to 0.
 */
const LEAVE = 0

/**
 * Continue action set to 1.
 */
const CONTINUE = 1

const NB_HIGH_CARDS = 5

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
  nbRound,
  onFullscreen,
  winner
}) => {
  const [deck] = useState(new Array(10).fill(0));
  const [showDraw, setShowDraw] = useState(false)
  const [showDrawnCard, setShowDrawnCard] = useState(null)
  const [highCards, setHighCards] = useState([]);
  const [flip, setFlip] = useState(false)
  const [token, setToken] = useState(0)
  const [newRound, setNewRound] = useState(false)
  const [showReturnLobbyButton, setShowReturnLobbyButton] = useState(false)
  const [roundWinner, setRoundWinner] = useState(false)

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
    socket.on('game:flip-card', ({ lastCard }) => {
      setShowDrawnCard(lastCard)
      setShowDraw(true)
      setTimeout(() => {
        setFlip(true);        
      }, 200);
    })
  }, [socket]);


  useEffect(() => {
    socket.on(
      'game:update-game',
      ({ gameState, isAllLeaving }) => {
        if(!isAllLeaving) {
          let drawnCardTimer = setTimeout(() => {
            console.log(gameState.highCards)
            setShowDraw(false)
            setShowDrawnCard(null)
            setFlip(false)
            setToken(gameState.gold)
            setHighCards(gameState.highCards)
          }, 2000);

          return () => {
            clearTimeout(drawnCardTimer)
          }
        }
      }
    )
  }, [socket, highCards])


  useEffect(() => {
    socket.on('game:new-round', ({ gameState, totalRound }) => {
      if(gameState.round > totalRound)
        return
      
      setHighCards(gameState.highCards)
      setRoundWinner(true)

      let roundWinnerTimer = setTimeout(() => {
        setRoundWinner(false)
        setNewRound(true)
      }, 1500);

      let newRoundTimer = setTimeout(() => {
        setHighCards([])
        setFlip(false);
        setToken(0)
        setNewRound(false);
      }, 3000)

      return () => { 
        clearTimeout(newRoundTimer) 
        clearTimeout(roundWinnerTimer) 
      }
    })
  }, [socket])


  const renderRoundWinner = () => {
    const sortedUsers = users
      .sort((u1, u2) => (u1.currentGold < u2.currentGold ? 1 : -1))
      .slice(0, 3)
      .filter(usr => usr.action === LEAVE)
    console.log(sortedUsers)
    console.log(sortedUsers.length)
    return (
      <div 
        className={"bg-winner"}
        style={{ animation: "bg-color 1.5s linear" }}
      >
        <div 
          className="winner-container"
          style={{ animation: "popup-scale 1.2s linear" }}
        >
          <div className="winner-container-avatar">
            {sortedUsers.length === 0 ?
              <div className="winner-container-img">
                <p style={{fontSize: "200px"}}> 
                  🤷‍♂️
                </p>
              </div>
              :
              sortedUsers.map(usr => 
                <div className="winner-container-img">
                  <img src={usr.img} alt="back" />
                  <p> {usr.name} </p>
                  <div className="winner-tokens">
                    <img 
                      src={IMGS["token"]} 
                      alt="token" 
                    />
                    <CountUp
                      start={0}
                      end={usr.currentGold}
                      duration={3}
                      delay={0}
                    >
                      {({ countUpRef }) => (
                        <p ref={countUpRef} />
                      )}
                    </CountUp>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render all users in the game and show the status
   * of each user (white = leaving status, red =
   * must play and green = played) with the number
   * of gold.
   */
  const renderUsers = () => {
    return (
      <div className="div-users-container">
        {
          users.map((usr, index) => (
            <div 
              key={index}
              className="div-users-profile"
              style={
                USERS_POS[users.length - 1][index]}
            >
              <img 
                className="div-users-profile--img" 
                src={usr.img} 
                alt="pp"
                style={{opacity: usr.checked ? 0.25 : 1}}
              />
              {
                usr.left && 
                  <img 
                    className="div-users-profile--cross" 
                    src={IMGS["cross"]} 
                    alt="cross"
                    style={{opacity: usr.checked ? 0.25 : 1}}
                  />
              }
              <div style={{opacity: usr.checked ? 0.25 : 1}}>
                <p className="div-users-name"> {usr.name.substring(0, 5)} </p>
                <div className="div-users-tokens">
                  <img 
                    src={IMGS["token"]} 
                    alt="token" 
                    style={
                      usr.currentGold !== usr.lastGold && 
                      usr.currentGold - usr.lastGold > 4 ? 
                      {animation: "grow 1s linear"} : null
                    }
                  />
                  {usr.currentGold && usr.lastGold ? 
                    <CountUp
                      start={usr.lastGold}
                      end={usr.currentGold}
                      duration={3}
                      delay={0}
                    >
                      {({ countUpRef }) => (
                        <p 
                          ref={countUpRef} 
                          style={
                            usr.currentGold !== usr.lastGold && 
                            usr.currentGold - usr.lastGold > 4 ? 
                            {animation: "grow 1s linear"} : null
                          }
                        />
                      )}
                    </CountUp> 
                    : <p> {usr.currentGold} </p>
                  }
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }

  const renderNextRound = () => {
    return (
      <div 
        className={"bg-turn"}
        style={{ animation: "bg-color 1.5s linear" }}
      >
        <div 
          className="next-turn-container"
          style={{ animation: "popup-scale 1.2s linear" }}
        >
          <p> TOUR {gameState.round}/{nbRound} </p>
        </div>
      </div>
    )
  }

  const onReturnLobby = () => {
    socket.emit('game:restart')
    setShowDraw(false);
    setShowDrawnCard(null);
    setHighCards([]);
    setFlip(false);
    setToken(0);
    setNewRound(false);
  }

  const renderWinner = () => {
    return (
      <div 
        className={"bg-winner"}
        style={{ animation: "bg-color 1.5s linear" }}
      >
        <div 
          className="winner-container"
          style={{ animation: "popup-scale 1.2s linear" }}
        >
          <img
            className="winner-crown-img"
            src={IMGS["crown"]}
            alt="crown"
            style={{animation: "rotating 0.9s ease infinite"}}
          />

          <img 
            src={winner.img} 
            alt="back"
          />
          <p> {winner.name} </p>
          <button 
            onClick={() => onReturnLobby()}
            style={{visibility: showReturnLobbyButton ? "visible": "hidden" }}
          > 
            RETOURNER AU LOBBY
          </button>
        </div>
      </div>
    )
  }

  const renderFlipCard = () => {
    let type = showDrawnCard.type;
    let dupIndex = -1;

    if(showDrawnCard.type === 0) {
      dupIndex = dupCard ? -1 : highCards.length
    }

    return (
      <div className="flip-card-container"
      style={
        type === 0 ? 
          dupIndex !== -1 ? 
            { animation: `${ANIM_FLIP[highCards.length]} 1.8s linear` } :
            null
          :
          flip ? 
            { animation : 'grow-down 1.8s linear' } :
            null
          
      }
      >
        <div 
          className="flip-card" 
          style={flip ? { transform: 'rotateY(180deg)'}: null}
        >
          <div className="flip-card-front">
            <img 
              src={IMGS["back"]}
              alt="back-img" 
            />
          </div>
          <div className="flip-card-back">
            <img 
              src={IMGS[showDrawnCard.name]}
              alt="drawn-img" 
            />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render the list of drawn cards.
   */
  const renderDeck = () => {
    if(gameState && gameState.deck) {
      return (
        <div className="div-gameboard--board">
          <div className="decklist-container">
            <div className="div-decklist">
              {
                deck.map((_, index) => (
                  <img 
                    key={index}
                    src={IMGS["back"]}
                    alt="back-img"
                    style={{ transform: `translateY(${-4 * (index + 1)}px`}}
                  />
                ))
              }
              <p> {gameState.nbCards} </p>
              <div className="decklist-jokers">
                {
                  (gameState && gameState.stars) &&
                    gameState.stars.map((_, index) => (
                      <img
                        key={index}
                        src={IMGS["jokerImg"]}
                        alt="joker-img"
                        style={{left: `${50 * index}px`}}
                      />
                    ))
                }
              </div>
            </div>
          </div>

          {(showDraw && showDrawnCard) && renderFlipCard()}
        </div>
      );
    }
  }

  const renderToken = () => {
    return (
      <div className="div-token-chest">
        <img src={IMGS["token"]} alt="tokens" />
        <CountUp
          start={token}
          end={gameState.gold}
          duration={2}
          delay={0}
        >
          {({ countUpRef }) => (
            <p ref={countUpRef} />
          )}
        </CountUp>
      </div>
    );
  }


  const renderHighCards = () => {
    const hCards = new Array(highCards.length).fill(1)

    const cardsContainer = hCards.map((_, index) => {
      return (
        <div 
          key={index}
          className="highcard-container"
          style={{left: `${11 + 17 * index}%`}}
        >
          {
            highCards[index] !== null ? 
              <img src={IMGS[highCards[index].name]} alt="high-card" /> :
              null
          }
        </div>          
      )
    })

    const remainingCards = NB_HIGH_CARDS - highCards.length
    const eCards = new Array(remainingCards).fill(0)

    const emptyContainer = eCards.map((_, index) => {
      return (
        <div 
          key={index}
          className="highcard-container"
          style={{left: `${11 + 17 * (index + highCards.length)}%`}}
        >
        </div>
      )
    });

    return (
      <>
        {cardsContainer}
        {emptyContainer}
      </>
    )
    /* return (
      highCards.map((card, index) => {
        if(card === null) {
          return (
            <div 
              key={index}
              className="highcard-container"
              style={{left: `${11 + 17 * index}%`}}
            >
            </div>
          )
        }

        return (
          <div 
            key={index}
            className="highcard-container"
            style={{left: `${11 + 17 * index}%`}}
          >
            <img src={IMGS[card.name]} alt="high-card" />
          </div>
        )
      }) 
    );*/
  }

  const renderHighCardsHighlight = () => {
    const lastCard = showDrawnCard ? showDrawnCard.name : null;
    const hCards = new Array(highCards.length).fill(1)

    const cardsContainer = hCards.map((_, index) => {
      return (
        <div 
          key={index}
          className="highcard-container"
          style={{left: `${11 + 17 * index}%`}}
        >
          {
            highCards[index] !== null ? 
              <img 
                src={IMGS[highCards[index].name]} 
                alt="high-card" 
                style={{opacity: lastCard === highCards[index].name ? 1 : 0.25}}
              /> :
              null
          }
        </div>          
      )
    })

    const remainingCards = NB_HIGH_CARDS - highCards.length
    const eCards = new Array(remainingCards).fill(0)

    const emptyContainer = eCards.map((ec, index) => {
      return (
        <div 
          key={index}
          className="highcard-container"
          style={{left: `${11 + 17 * (index + highCards.length)}%`}}
        >
        </div>
      )
    });

    return (
      <>
        {cardsContainer}
        {emptyContainer}
      </>
    )

    /* return (
      highCards.map((card, index) => {
        if(card === null) {
          return (
            <div 
              key={index}
              className="highcard-container"
              style={{left: `${11 + 17 * index}%`}}
            >
            </div>
          )
        }

        return (
          <div 
            key={index}
            className="highcard-container"
            style={{left: `${11 + 17 * index}%`}}
          >
            <img 
              src={IMGS[card.name]} 
              alt="high-card"
              style={{opacity: lastCard.name === card.name ? 1 : 0.25}}
            />
          </div>
        )
      })
    ) */
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
              <img src={IMGS["draw"]} alt="draw" />
            </div>
            <div
              onClick={(e) => onAction(e, LEAVE)}
              className="div-container div-users--leave"
            >
              <img src={IMGS["quit"]} alt="draw" />
            </div>
          </>
        ) : null}
      </div>
    )
  }

  useEffect(() => {
    socket.on('game:end-game', () => {
      setTimeout(() => {
        setShowReturnLobbyButton(true)
      }, 5500);
    })
  }, [socket])


  const renderTurn = () => {
    return <p className="turn-container"> Tour {gameState.round}/{nbRound} </p>
  }

  return (
    <div id="game-container-id" className="div-game-container">
      {winner && renderWinner()}
      {roundWinner && renderRoundWinner()}
      <img 
        className="game-full-screen" 
        src={IMGS["fullScreen"]}
        onClick={onFullscreen}
        alt="full-screen"
      />
      <div className="div-game">
          {!showDraw && renderUserAction()}
          {renderDeck()}
          {
            dupCard ? 
              renderHighCardsHighlight() : 
              renderHighCards()
          }
          {renderToken()}
          {renderUsers()}
          {renderTurn()}
          {newRound && renderNextRound()}
      </div>
    </div>
  )
}

export default Game
