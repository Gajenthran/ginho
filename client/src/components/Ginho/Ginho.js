import React, { useState, useEffect } from "react";
import queryString from 'query-string';

import socket from './../../config/socket';

import Lobby from './../Lobby/Lobby';
import Rank from './../Rank/Rank';
import Game from './../Game/Game';
import Navbar from './../Navbar/Navbar';

const GAMESTATE = 0, LOBBYSTATE = 1, RANKSTATE = 2;

const Ginho = ({ location }) => {
  const [users, setUsers] = useState([]);
  const [gold, setGold] = useState(0);
  const [currentGold, setCurrentGold] = useState(0);
  const [userGold, setUserGold] = useState(0);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState([]);
  const [nbCards, setNbCards] = useState(0);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [action, setAction] = useState(true);
  const [duplicatedCard, setDuplicatedCard] = useState(false);
  const [hasRemainingUser, setHasRemainingUser] = useState(true);
  const [playState, setPlayState] = useState(LOBBYSTATE);
  const [options, setOptions] = useState({});
  // const [stars, setStars] = useState([]);

  const updateGameState = (gameState) => {
    setUsers(gameState.users);
    setRound(gameState.round);
    setGold(gameState.gold);

    for (let i = 0; i < gameState.users.length; i++) {
      if (gameState.users[i].id === socket.id) {
        setCurrentGold(gameState.users[i].currentGold);
        setUserGold(gameState.users[i].gold);
        let action = !gameState.users[i].checked;
        setAction(action);
      }
    }
  };

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });
  }, [location.search]);

  useEffect(() => {
    socket.on('new-game', ({ gameState, options }) => {
      setOptions(options);
      setGold(gameState.gold);
      setRound(gameState.round);
      setDeck(gameState.deck);
      setNbCards(gameState.nbCards);
      setCurrentGold(0);
      setUserGold(0);
      setUsers(gameState.users);
      setPlayState(GAMESTATE);
    });
  }, []);

  useEffect(() => {
    socket.on('update-users-action', ({ error, gameState }) => {
      if (error) alert(error);
      updateGameState(gameState);
    });
  }, []);

  useEffect(() => {
    socket.on(
      'update-game',
      ({ error, gameState, noRemainingUser, dupCard }) => {
        if (error) alert(error);

        window.scrollTo(0, 0);

        updateGameState(gameState);
        setHasRemainingUser(!noRemainingUser);
        if (!noRemainingUser)
          setDeck(gameState.deck);
        setDuplicatedCard(dupCard)
      });
  }, []);

  useEffect(() => {
    socket.on('draw-card', ({ error, deck }) => {
      if (error) alert(error);
      setDeck(deck);
    });
  }, []);

  useEffect(() => {
    socket.on('new-round', ({ error, gameState }) => {
      if (error) alert(error);

      setTimeout(() => {
        setDeck(gameState.deck);
        setDuplicatedCard(false);
        setHasRemainingUser(true);
        updateGameState(gameState);
      }, 2000);
    });
  }, []);

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

  useEffect(() => {
    socket.on("room-users", ({ users }) => {
      setUsers(users);
    });
  }, []);

  return (
    <>
      <Navbar />
      {playState === LOBBYSTATE ?
        <>
          <Lobby location={location} name={name} room={room} users={users} />
        </>
        : playState === GAMESTATE ?
          <Game
            socket={socket}
            gold={gold}
            round={round}
            deck={deck}
            nbCards={nbCards}
            users={users}
            userGold={userGold}
            currentGold={currentGold}
            name={name}
            action={action}
            dupCard={duplicatedCard}
            hasRemainingUser={hasRemainingUser}
            nbRound={options.nbRound}
          />
          :
          <>
            <Rank
              socket={socket}
              users={users}
            />
          </>
      }
    </>
  );
}

export default Ginho;
