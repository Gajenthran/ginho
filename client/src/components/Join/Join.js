import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Fade } from 'react-bootstrap';

import './Home.css';
import Navbar from './../Navbar/Navbar';

const Home = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [hoverGame, setHoverGame] = useState(false);
  const [hoverCredits, setHoverCredits] = useState(false);
  const [hoverRules, setHoverRules] = useState(false);

  return (
    <>
      <Navbar />
      <div className="div-home">
        <div className="div-home--row">
          <div onMouseEnter={() => setHoverGame(true)} onMouseLeave={() => setHoverGame(false)} className="home--container div-home--row--game">
            <h3> JOUER </h3>
            <Fade in={hoverGame}>
              <h5> UNE PARTIE </h5>
            </Fade>
            <div>
              <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
              <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
              <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/diamant?name=${name}&room=${room}`}>
                <button className={'button mt-20'} type="submit"> REJOINDRE </button>
              </Link>
            </div>
          </div>
          <div onMouseEnter={() => setHoverRules(true)} onMouseLeave={() => setHoverRules(false)} className="home--container div-home--row--rules">
            <h3> RÈGLES </h3>
            <Fade in={hoverRules}>
              <div>
                <h5> DU JEU </h5>
                <div className="div-home--row--rules-desc">
                  Le jeu est composé de 34 cartes :
                  14 cartes trésor (1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15 gemmes),
                  15 cartes piège (3 de chaque type : feu, éboulement, momie, serpent et araignée),
                  5 cartes relique (artéfact).
                  <br />
                  Au début du jeu, toutes les cartes trésor et piège sont mélangées ensemble, les cartes reliques (artéfacts) sont mises de côté. A chaque début d'expédition une carte relique (artéfact) est ajoutée au paquet.
                  <br />
                  Le jeu comporte 5 manches (expéditions). L'aventurier avec le plus de points à la fin de partie gagne : chaque gemme récoltée vaut 1 point et chaque relique (artéfact) vaut 5 points.
                </div>
              </div>
            </Fade>
          </div>
        </div>
        <div onMouseEnter={() => setHoverCredits(true)} onMouseLeave={() => setHoverCredits(false)} className="div-home--row--credits-list">
          <div className="home--container">
            <h3> CRÉDITS </h3>
            <Fade in={hoverCredits}>
              <div className="div-home--row--rules-desc">
                Créé et développé par Gajenthran PANCHALINGAMOORTHY.
              </div>
            </Fade>
          </div>
          <div className="home--container"> </div>
        </div>
      </div>
    </>
  );
};

export default Home;
