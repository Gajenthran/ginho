import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { Spinner } from 'react-bootstrap'

import socket from './../../config/socket'

import Lobby from './../Lobby/Lobby'
import Profile from './../Profile/Profile'
import Rank from './../Rank/Rank'
import Game from './../Game/Game'
import Navbar from './../Navbar/Navbar'

/**
 * Ginho states with 3 states: game, lobby and rank.
 */

const PROFILE_STATE = 0
const LOBBYSTATE = 1
const GAMESTATE = 2
const RANKSTATE = 3

/**
 * Ginho component with 3 states:
 * lobby component, game component
 * and rank component.
 *
 * @param {object} location - get query string
 */
const Ginho = ({ location }) => {
  const [gameState, setGameState] = useState({
    gold: 0,
    round: 1,
    nbCards: 0,
    deck: [],
  })
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({})
  const [duplicatedCard, setDuplicatedCard] = useState(false)
  const [hasRemainingUser, setHasRemainingUser] = useState(true)
  const [lobbyChecked, setLobbyChecked] = useState(false)
  const [playState, setPlayState] = useState(LOBBYSTATE)
  const [options, setOptions] = useState({})
  const [winner, setWinner] = useState(null)

  const onFullscreen = () => {
    const elem = document.getElementById('game-container-id')

    // Firefox
    if (document.mozFullScreenEnabled) {
      if (!document.mozFullScreenElement) {
        elem.mozRequestFullScreen();
      } else {
        document.mozCancelFullScreen();
      }
    }

    if (document.fullscreenElement) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    // Safari
    if (document.webkitFullscreenEnabled) {
      if (!document.webkitFullscreenElement) {
        elem.webkitRequestFullscreen();
      } else {
        document.webkitExitFullscreen();
      }
    }

    // Edge
    if (document.msFullscreenEnabled) {
      if (!document.msFullscreenElement) {
        elem.msRequestFullscreen();
      } else {
        document.msExitFullscreen();
      }
    }
  }

  useEffect(() => {
    socket.on('lobby:create-response', ({ user }) => {
      setUser(user)
      setUsers([user])
      setPlayState(LOBBYSTATE)
    })
  })

  useEffect(() => {
    socket.on(
      'lobby:join-response-user',
      ({ user, users, gameStarted, gameState, options }) => {
        setUser(user)
        setUsers(users)
        setPlayState(gameStarted ? GAMESTATE : LOBBYSTATE)
        if (gameStarted) {
          setGameState(gameState)
          setOptions(options)
        }
      }
    )
  }, [])

  useEffect(() => {
    socket.on('lobby:join-response-all', ({ users }) => {
      setUsers(users)
    })
  })

  useEffect(() => {
    const { room } = queryString.parse(location.search)
    if (!lobbyChecked && room) {
      socket.emit('lobby:check', { room })
      socket.on('lobby:check-response', ({ error, roomExist, userExist }) => {
        if (error) window.location.href = '/'
        else {
          let state = null
          if (roomExist && userExist) state = LOBBYSTATE
          else state = PROFILE_STATE
          setPlayState(state)
          setLobbyChecked(true)
        }
      })
    }
  }, [location.search, lobbyChecked])


  /**
   * Create a new game.
   */
  useEffect(() => {
    socket.on('game:new-game', ({ users, gameState, options }) => {
      setPlayState(GAMESTATE)
      setUser(users.find((user) => user.id === socket.id))
      setUsers(users)
      setGameState((prevGameState) => ({
        ...prevGameState,
        ...gameState,
      }))
      setOptions(options)
    })
  }, [])

  /**
   * Update users actions.
   */
  useEffect(() => {
    socket.on('game:update-action-response', ({ users, gameState }) => {
      setGameState((prevGameState) => ({ ...prevGameState, ...gameState }))
      setUser(users.find((u) => u.id === socket.id))
      setUsers(users)
    })
  }, [])

  /**
   * Update game, by updating game state, checking if there is
   * remaining user and duplicate card.
   */
  useEffect(() => {
    socket.on(
      'game:update-game',
      ({ users, gameState, noRemainingUser, dupCard, isAllLeaving }) => {
        window.scrollTo(0, 0)

        if(isAllLeaving) {
          if(isAllLeaving) gameState.deck = gameState.deck.slice(0, -1)

          setUser(users.find((u) => u.id === socket.id))
          setUsers(users)
          setHasRemainingUser(!noRemainingUser)
          setGameState((prevGameState) => ({
            ...prevGameState,
            ...gameState,
          }))
          setDuplicatedCard(dupCard)
        } else {
          setTimeout(() => {
            if(isAllLeaving) gameState.deck = gameState.deck.slice(0, -1)

            setUser(users.find((u) => u.id === socket.id))
            setUsers(users)
            setHasRemainingUser(!noRemainingUser)
            setGameState((prevGameState) => ({
              ...prevGameState,
              ...gameState,
            }))
            setDuplicatedCard(dupCard)
          }, 1000);
        }
    }
    )
  }, [])

  /**
   * Start a new round.
   */
  useEffect(() => {
    socket.on('game:new-round', ({ users, gameState }) => {
      setTimeout(() => {
        setUser(users.find((u) => u.id === socket.id))
        setUsers(users)
        setDuplicatedCard(false)
        setHasRemainingUser(true)
        setGameState((prevGameState) => ({
          ...prevGameState,
          ...gameState,
        }))
      }, 2000)
    })
  }, [])

  /**
   * Go to the top of the screen.
   */
  useEffect(() => {
    socket.on('game:restart-response', () => {
      setPlayState(LOBBYSTATE)
    })
  }, [])

  /**
   * End the game. Show the rank.
   */
  useEffect(() => {
    socket.on('game:end-game', ({ users }) => {
      setUsers(users)
      setWinner(users[0])

      setTimeout(() => {
        setPlayState(RANKSTATE)
        setWinner(null)
      }, 3000)
    })
  }, [])

  useEffect(() => {
    socket.on('game:disconnect', ({ users }) => {
      setUsers(users)
    })
  }, [])

  return (
    <>
      {
        !(
          document.mozFullScreenElement || document.fullscreenElement || 
          document.webkitFullscreenElement || document.msFullscreenElement
        ) && <Navbar/>
      }
      {playState === PROFILE_STATE ? (
        <Profile location={location} />
      ) : playState === LOBBYSTATE ? (
        <Lobby location={location} user={user} users={users} />
      ) : playState === GAMESTATE ? (
        <Game
          socket={socket}
          user={user}
          gameState={gameState}
          users={users}
          dupCard={duplicatedCard}
          hasRemainingUser={hasRemainingUser}
          nbRound={options.nbRound}
          onFullscreen={onFullscreen}
          winner={winner}
        />
      ) : playState === RANKSTATE ? (
        <Rank socket={socket} users={users} />
      ) : (
        <div className="spinner-container">
          <Spinner
            className="users-spinner--loading"
            animation="border"
            role="status"
          />
        </div>
      )}
    </>
  );
}

export default Ginho
