import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import socket from './../../config/socket';

import Chat from './../Chat/Chat';
import Rank from './../Rank/Rank';
import Game from './../Game/Game';
import Navbar from './../Navbar/Navbar';

const LEAVE = 0, CONTINUE = 1;

const Diamant = ({ location }) => {
  const [users, setUsers] = useState([]);
  const [rankEnabled, setRankEnabled] = useState(false);
  const [gold, setGold] = useState(0);
  const [currentGold, setCurrentGold] = useState(0);
  const [userGold, setUserGold] = useState(0);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState([]);
  const [nbCards, setNbCards] = useState(0);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [start, setStart] = useState(false);
  const [action, setAction] = useState(true);

  const updateGameState = (gameState) => {
    setStart(true);
    setUsers(gameState.users);
    setRound(gameState.round);
    setGold(gameState.gold);

    for (let i = 0; i < gameState.users.length; i++) {
      if (gameState.users[i].id == socket.id) {
        setCurrentGold(gameState.users[i].currentGold);
        setUserGold(gameState.users[i].gold);
        let action = !gameState.users[i].checked;
        // if (gameState.allChecked) action = true;
        // if(gameState.users[i].left) action = false;
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
    socket.on('new-game', ({ gameState, room }) => {
      setStart(true);
      setGold(gameState.gold);
      setRound(gameState.round);
      setDeck(gameState.deck);
      setNbCards(gameState.nbCards);
      setCurrentGold(0);
      setUserGold(0);
      setUsers(gameState.users);
      setRankEnabled(false);
    });
  }, []);

  useEffect(() => {
    socket.on('update-users-action', ({ error, gameState, room }) => {
      if (error) alert(error);
      updateGameState(gameState);
    });
  }, []);

  useEffect(() => {
    socket.on('update-game', ({ error, gameState, room }) => {
      if (error) alert(error);

      updateGameState(gameState);
      setGold(gameState.gold);
      setUsers(gameState.users);
      setDeck(gameState.deck);
    });
  }, []);

  useEffect(() => {
    socket.on('draw-card', ({ error, deck }) => {
      setDeck(deck);
    });
  }, []);

  useEffect(() => {
    socket.on('new-round', ({ error, gameState, room }) => {
      if (error) alert(error);

      setTimeout(() => {
        alert('New round.');
        setDeck(gameState.deck);
        setStart(true);
        setGold(gameState.gold);
        setUsers(gameState.users);
        updateGameState(gameState);
      }, 2000);

    });
  }, []);

  useEffect(() => {
    socket.on('end-game', ({ error, gameState, room }) => {
      if (error) alert(error);
      gameState.users.sort((u1, u2) => u1.gold < u2.gold ? 1 : -1);
      updateGameState(gameState);
      setRankEnabled(true);
    });
  }, []);

  useEffect(() => {
    socket.on("room-users", ({ users }) => {
      setUsers(users);
      console.log(users);
    });
  }, []);

  const startGame = (event) => {
    event.preventDefault();

    socket.emit('start-game');
    setStart(true);
  };

  return (
    <>
      <Navbar />
      {start === false ?
        <>
          <Chat location={location} name={name} room={room} users={users} />
          <button onClick={e => startGame(e)}> Lancer une partie </button>
        </>
        : rankEnabled === false ?
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

export default Diamant;
