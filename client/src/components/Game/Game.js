import React from 'react';
import { ProgressBar } from 'react-bootstrap';

import './Game.css';

import goldImg from './../../assets/img/gold.png';
import starImg from './../../assets/img/star.png';
import greenButtonImg from './../../assets/img/greenbutton.png';
import redButtonImg from './../../assets/img/greenbutton.png';
import blooperImg from './../../assets/img/blooper.png';
import bowserImg from './../../assets/img/bowser.png';
import koopaImg from './../../assets/img/koopa.png';
import piranhaImg from './../../assets/img/piranha.png';
import thwompImg from './../../assets/img/thwomp.png'
import deckImg from './../../assets/img/deck.png'

const LEAVE = 0, CONTINUE = 1;

const TRAP_CARDS = {
  'gold': { 'img': goldImg, name: 'PIÈCES' },
  'star': { 'img': starImg, name: 'ÉTOILES' },
  'fire': { 'img': blooperImg, name: 'BLOOPER' },
  'water': { 'img': koopaImg, name: 'KOOPA' },
  'wind': { 'img': piranhaImg, name: 'PIRANHA' },
  'earth': { 'img': thwompImg, name: 'THWOMP' },
  'space': { 'img': bowserImg, name: 'BOWSER' },
};


const Game = ({ socket, gold, round, deck, nbCards, users, userGold, currentGold, name, action }) => {

  const handleAction = (event, action) => {
    event.preventDefault();
    socket.emit('update-user', { action }, ({ gameState, error }) => { });
  }

  const renderUsers = () => {
    return (
      <>
        <div className="div-users--infos-list" key={socket.id}>
          <div className="div-users--name">
            <img src={greenButtonImg} alt="green-button" />
            {name}
          </div>
          <div className="div-users--gold">
            <img src={goldImg} alt="gold" />
            <div> {currentGold} <span> ({userGold}) </span></div>
          </div>
        </div>
        {users.map(user =>
          user.id !== socket.id &&
          <div className="div-users--infos-list" key={user.id}>
            <div className="div-users--name">
              <img src={user.checked ? greenButtonImg : redButtonImg} alt="check-button" />
              {user.name}
            </div>
            <div className="div-users--gold">
              <img src={goldImg} alt="gold" />
              <div> {user.currentGold} </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderDeck = () => {
    return (
      <div className="div-container div-gameboard--board">
        {deck.map(card =>
          <div className="div-gameboard--card" key={card.id}>
            <div>
              {card.name === 'gold' ?
                <>
                  <img src={TRAP_CARDS[card.name].img} alt="gold" />
                  <div className="div-gameboard--card-gold"> {card.score} <span> {TRAP_CARDS[card.name].name} </span></div>
                </>
                :
                card.name === 'trap' ?
                  <>
                    <img src={TRAP_CARDS[card.element].img} alt="gold" />
                    <div className="div-gameboard--card-trap"> {TRAP_CARDS[card.element].name}</div>
                  </>
                  :
                  card.name === 'star' ?
                    // TODO: filter grayscale
                    <>
                      <img src={TRAP_CARDS[card.name].img} alt="gold" />
                      <div className="div-gameboard--card-star"> {TRAP_CARDS[card.name].name}</div>
                    </>
                    :
                    `Problem with database.`
              }
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="div-game">
      <div className="div-game--layout">
        <div className="div-gameboard--layout">
          <div className="div-container div-gameboard--infos">
            <div className="div-gameboard-icons">
              <img className="game--icons" src={goldImg} alt='gold' />
              <div> {gold} </div>
            </div>
            <div className="div-gameboard-icons div-gameboard-deck">
              <img className="game--icons" src={deckImg} alt="deck" />
              <div> {deck.length} <span> ({nbCards}) </span></div>
            </div>
            <div className="div-gameboard--progress">
              <ProgressBar now={(round / 3) * 100} />
            </div>
          </div>
          <div className="div-container div-gameboard--board">
            {renderDeck()}
          </div>
        </div>
        <div id="div-users--container">
          <div className="div-container div-users--infos">
            {renderUsers()}
          </div>
          <div className="div-users--action">
            {action ?
              <>
                <div onClick={e => handleAction(e, CONTINUE)} className="div-container div-users--continue">
                  <i className="fas fa-gavel"></i>
                </div>
                <div onClick={e => handleAction(e, LEAVE)} className="div-container div-users--leave">
                  <i className="fas fa-walking"></i>
                </div>
              </>
              :
              null
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;