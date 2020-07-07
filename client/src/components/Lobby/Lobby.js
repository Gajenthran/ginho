import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import socket from './../../config/socket';

import Chat from './../Chat/Chat';

const Lobby = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [start, setStart] = useState(false);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [location.search]);

  useEffect(() => {
    socket.on('new-game', () => {
      setStart(true);
    });
  }, []);

  const startGame = (event) => {
    event.preventDefault();

    socket.emit('start-game');
    setStart(true);
  }

  return (
    <>
      {start === false ?
        <>
          <Chat location={location} name={name} room={room} />
          <button onClick={e => startGame(e)}> Lancer une partie </button>
        </>
        :
        <p> toto </p>
      }
    </>
  );
}

export default Lobby;
