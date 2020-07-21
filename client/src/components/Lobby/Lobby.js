import React, { useState } from "react";
import RangeSlider from 'react-bootstrap-range-slider';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { Fade } from "react-bootstrap";

import socket from './../../config/socket';

import './Lobby.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import greenButtonImg from './../../assets/img/greenbutton.png';

/**
 * Lobby component to manage the game options and
 * start the game.
 * 
 * @param {object} lobbyUsers - lobby users
 * @param {string} [lobbyUsers.name] - username
 * @param {string} [lobbyUsers.room] - user room
 * @param {array} users - others users in the room
 */
const Lobby = ({ name, room, users }) => {
  const [hoverRules, setHoverRules] = useState(false);
  const [hoverUsers, setHoverUsers] = useState(false);
  const [nbRound, setNbRound] = useState(3);
  const [nbPlayer, setNbPlayer] = useState(2);
  const [x2Stars, setx2Stars] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [roundOptions, setRoundOptions] = useState(false);
  const [x2Options, setX2Options] = useState(false);
  const [playerOptions, setPlayerOptions] = useState(false);
  const [dupOptions, setDupOptions] = useState(false);

  /**
   * Start the game and emit options game to the server.
   * 
   * @param {object} event - event
   */
  const startGame = (event) => {
    event.preventDefault();
    socket.emit(
      'start-game',
      { nbRound, nbPlayer, x2Stars, duplicate }, (error) => {
        if (error) alert(error);
      });
  };

  /**
   * Render all users in the lobby.
   */
  const renderUsers = () => {
    return (
      <div
        onMouseEnter={() => setHoverUsers(true)}
        onMouseLeave={() => setHoverUsers(false)}
        className="lobby--container lobby-users-list"
      >
        <h3> JOUEURS</h3>
        <Fade in={hoverUsers}>
          <h5> ({users.length}) </h5>
        </Fade>
        <div className="lobby-users--list-row">
          <div className="lobby-users--infos-list" key={socket.id}>
            <div className="lobby-users--name">
              <img src={greenButtonImg} alt="green-button" />
              {name}
            </div>
          </div>
          {users.map(user =>
            user.id !== socket.id &&
            <div className="lobby-users--infos-list" key={user.id}>
              <div className="lobby-users--name">
                <img src={greenButtonImg} alt="check-button" />
                {user.name}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render game options.
   */
  const renderOptions = () => {
    return (
      <div
        onMouseEnter={() => setHoverRules(true)}
        onMouseLeave={() => setHoverRules(false)}
        className="lobby--container lobby-users-options"
      >
        <h3> OPTIONS </h3>
        <Fade in={hoverRules}>
          <h5> DE JEU </h5>
        </Fade>
        <div className="lobby-users-options-list">
          <div
            onMouseEnter={() => setRoundOptions(true)}
            onMouseLeave={() => setRoundOptions(false)}
          >
            <h6> TOURS </h6>
            <Fade in={roundOptions}>
              <div className="lobby-users-options-desc">
                Nombre de tours par partie
          </div>
            </Fade>
            <RangeSlider
              min={2}
              max={5}
              value={nbRound}
              onChange={e => setNbRound(Number(e.target.value))}
            />
          </div>
          <div
            onMouseEnter={() => setPlayerOptions(true)}
            onMouseLeave={() => setPlayerOptions(false)}
          >
            <h6> JOUEURS</h6>
            <Fade in={playerOptions}>
              <div className="lobby-users-options-desc">
                Nombre de joueurs max. dans une partie
          </div>
            </Fade>
            <RangeSlider
              min={2}
              max={6}
              value={nbPlayer}
              onChange={e => setNbPlayer(Number(e.target.value))}
            />
          </div>
          <div
            onMouseEnter={() => setX2Options(true)}
            onMouseLeave={() => setX2Options(false)}
          >
            <h6> x2 ÉTOILES </h6>
            <Fade in={x2Options}>
              <div className="lobby-users-options-desc">
                Les étoiles ne rapportent pas forcément 5 ors...
          </div>
            </Fade>
            <BootstrapSwitchButton
              onlabel={" "}
              offlabel={" "}
              checked={x2Stars}
              onstyle="outline-primary"
              offstyle="outline-secondary"
              width={130}
              height={5}
              onChange={() => setx2Stars(!x2Stars)}
            />
          </div>
          <div
            onMouseEnter={() => setDupOptions(true)}
            onMouseLeave={() => setDupOptions(false)}
          >
            <h6> PAS DE DOUBLONS </h6>
            <Fade in={dupOptions}>
              <div className="lobby-users-options-desc">
                Dès qu'une carte piège est piochée, c'est perdu
          </div>
            </Fade>
            <BootstrapSwitchButton
              onlabel={" "}
              offlabel={" "}
              checked={duplicate}
              onstyle="outline-primary"
              offstyle="outline-secondary"
              width={130}
              height={5}
              onChange={() => setDuplicate(!duplicate)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="div-lobby">
      <div className="lobby--container lobby-title">
        <h3> {room} </h3>
      </div>
      <div className="div-lobby--row">
        {renderOptions()}
        {renderUsers()}
      </div>

      <div
        onClick={e => startGame(e)}
        className="lobby--container lobby-start-game"
      >
        LANCER LA PARTIE
      </div>
    </div>
  );
}

export default Lobby;
