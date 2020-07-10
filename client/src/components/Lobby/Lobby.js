import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import socket from './../../config/socket';

import Chat from './../Chat/Chat';

const LEAVE = 0, CONTINUE = 1;

const Lobby = ({ location }) => {
  const [users, setUsers] = useState([]);
  const [rankEnabled, setRankEnabled] = useState(false);
  const [gold, setGold] = useState(0);
  const [currentGold, setCurrentGold] = useState(0);
  const [userGold, setUserGold] = useState(0);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState([]);
  const [nbCards, setNbCards] = useState(0);
  const [newRound, setNewRound] = useState(false);
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
      setUsers(gameState.users);
      setRankEnabled(false);
    });
  }, []);

  useEffect(() => {
    socket.on('update-users-action', ({ error, gameState, room }) => {
      if (error) alert(error);

      setStart(true);
      // setGold(gameState.gold);
      setUsers(gameState.users);
      // setDeck(gameState.deck);

      // setDeck(gameState.deck);
      // setNbCards(gameState.nbCards);

      /*  if (gameState.round != round) {
          setNewRound(true);
          setLastCard(gameState.lastCard)
          setTimeout(() => {
            alert('New round.');
            updateGameState(gameState);
          }, 2000);
        } else {
          setNewRound(false);
          updateGameState(gameState);
        } */
    });
  }, []);

  useEffect(() => {
    socket.on('update-game', ({ error, gameState, room }) => {
      if (error) alert(error);

      setStart(true);
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
        setNewRound(true);
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

  const handleRestart = (event) => {
    event.preventDefault();

    socket.emit('restart-game');
    setStart(true);
  };

  const handleAction = (event, action) => {
    event.preventDefault();
    console.log('handleAction');
    setAction(false);
    socket.emit('update-user', { action }, ({ gameState, error }) => {
      console.log('toto');
    });
  }

  return (
    <>
      {start === false ?
        <>
          <Chat location={location} name={name} room={room} users={users} />
          <button onClick={e => startGame(e)}> Lancer une partie </button>
        </>
        : rankEnabled === false ?
          <>
            <p> gold: {gold} </p>
            <p> round: {round} </p>
            <p> deck: {deck.length} </p>
            <p> nbCards: {nbCards} </p>
            <p> nbUsers: {users.length} </p>
            <br />
            <p> Username: {name}</p>
            <p> current-gold: {currentGold}</p>
            <p> total-gold: {userGold}</p>
            {action &&
              <>
                <button onClick={e => handleAction(e, LEAVE)}> Sortir </button>
                <button onClick={e => handleAction(e, CONTINUE)}> Continuer </button>
              </>
            }
            <br />

            {users.map(user =>
              user.id != socket.id &&
              <div key={user.id}>
                <p style={{ 'color': user.checked ? 'red' : 'blue' }}>
                  {user.name} : {user.checked ? 'Validé' : 'Non validé'}
                </p>
              </div>
            )}
            <br />

            {deck.map(card =>
              <div key={card.id}>
                {card.name === 'gold' ?
                  `${card.name} : x${card.score}` :
                  card.name === 'trap' ?
                    `${card.name} : ${card.element}` :
                    card.name === 'star' ?
                      `${card.name} : x${card.score}` :
                      `Problem with database.`
                }
              </div>
            )}
          </>
          :
          <>
            {users.map((user, index) =>
              <div key={user.id}>
                <p> {index + 1} - {user.name} (x{user.gold}) </p>
              </div>
            )}
            <br />
            <button onClick={e => handleRestart(e)}> Recommencer </button>
          </>
      }
    </>
  );
}

export default Lobby;
