import React, { useState, useEffect } from "react";
import queryString from 'query-string';

import socket from './../../config/socket';

import Lobby from './../Lobby/Lobby';
import Rank from './../Rank/Rank';
import Game from './../Game/Game';
import Navbar from './../Navbar/Navbar';

/**
 * Ginho states with 3 states: game, lobby and rank.
 */
const GAMESTATE = 0, LOBBYSTATE = 1, RANKSTATE = 2;

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
    deck: []
  });
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [duplicatedCard, setDuplicatedCard] = useState(false);
  const [hasRemainingUser, setHasRemainingUser] = useState(true);
  const [playState, setPlayState] = useState(LOBBYSTATE);
  const [options, setOptions] = useState({});

  /**
   * Update game state and user values.
   * 
   * @param {object} gState 
   */
  const updateGameState = (gState) => {
    for (let i = 0; i < gState.users.length; i++)
      if (gState.users[i].id === socket.id)
        setUser(gState.users[i]);

    setUsers(gState.users);
    setGameState({
      gold: gState.gold,
      round: gState.round,
      deck: gState.deck,
      nbCards: gState.nbCards
    });

  };

  /**
   * Get the query string and emit the username and the room
   * to the server, in order to join/create the room.
   */
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setUser({
      name,
      room
    });

    socket.emit('join', { name, room }, ({ error }) => {
      if (error) alert(error);
    });
  }, [location.search]);

  /**
   * Create a new game.
   */
  useEffect(() => {
    socket.on('new-game', ({ gameState, options }) => {
      setOptions(options);
      updateGameState(gameState);
      setPlayState(GAMESTATE);
    });
  }, []);

  /**
   * Update users actions.
   */
  useEffect(() => {
    socket.on('update-users-action', ({ error, gameState }) => {
      if (error) alert(error);
      updateGameState(gameState);
    });
  }, []);

  /**
   * Update game, by updating game state, checking if there is
   * remaining user and duplicate card.
   */
  useEffect(() => {
    socket.on(
      'update-game',
      ({ error, gameState, noRemainingUser, dupCard }) => {
        if (error) alert(error);

        window.scrollTo(0, 0);

        updateGameState(gameState);
        setHasRemainingUser(!noRemainingUser);
        if (!noRemainingUser)
          setGameState(state => ({
            ...state,
            deck: gameState.deck
          }));
        setDuplicatedCard(dupCard)
      });
  }, []);

  /**
   * Draw card.
   */
  useEffect(() => {
    socket.on('draw-card', ({ error, deck }) => {
      if (error) alert(error);
      setGameState(state => ({
        ...state,
        deck: deck
      }));
    });
  }, []);

  /**
   * Start a new round.
   */
  useEffect(() => {
    socket.on('new-round', ({ error, gameState }) => {
      if (error) alert(error);

      setTimeout(() => {
        setDuplicatedCard(false);
        setHasRemainingUser(true);
        updateGameState(gameState);
      }, 2000);
    });
  }, []);

  /**
   * End the game. Show the rank.
   */
  useEffect(() => {
    socket.on('end-game', ({ error, gameState }) => {
      if (error) alert(error);

      setTimeout(() => {
        gameState.users.sort((u1, u2) => u1.gold < u2.gold ? 1 : -1);
        updateGameState(gameState);
        setPlayState(RANKSTATE);
      }, 2000);
    });
  }, []);

  /**
   * Update room users. Add or remove users in the lobby.
   */
  useEffect(() => {
    socket.on("room-users", ({ users, gameStarted, gameState, gameOptions }) => {
      setUsers(users);
      if (gameStarted) {
        setPlayState(GAMESTATE);
        updateGameState(gameState);
        setOptions(gameOptions);
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      {playState === LOBBYSTATE ?
        <Lobby
          location={location}
          name={user.name}
          room={user.room}
          users={users}
        />
        : playState === GAMESTATE ?
          <Game
            socket={socket}
            user={user}
            gameState={gameState}
            users={users}
            dupCard={duplicatedCard}
            hasRemainingUser={hasRemainingUser}
            nbRound={options.nbRound}
          />
          :
          <Rank
            socket={socket}
            users={users}
          />
      }
    </>
  );
}

export default Ginho;
