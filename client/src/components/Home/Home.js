import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Fade } from 'react-bootstrap';

import './Home.css';

import Navbar from './../Navbar/Navbar';

const Home = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [hoverGame, setHoverGame] = useState(false);
  const [hoverRules, setHoverRules] = useState(false);

  return (
    <>
      <Navbar />
      <div className="div-home">
        <div className="div-home--row">
          <div
            onMouseEnter={() => setHoverGame(true)}
            onMouseLeave={() => setHoverGame(false)}
            className="home--container div-home--row--game"
          >
            <h3> JOUER </h3>
            <Fade in={hoverGame}>
              <h5> UNE PARTIE </h5>
            </Fade>
            <div className="div-home--form">
              <input
                placeholder="Name"
                className="joinInput"
                type="text"
                onChange={(event) => setName(event.target.value)}
              />
              <input
                placeholder="Room"
                className="joinInput mt-20"
                type="text"
                onChange={(event) => setRoom(event.target.value)}
              />
              <Link
                onClick={e => (!name || !room) ? e.preventDefault() : null}
                to={`/ginho?name=${name}&room=${room}`}
              >
                <button className={'button mt-20'} type="submit"> REJOINDRE </button>
              </Link>
            </div>
          </div>
          <div
            onMouseEnter={() => setHoverRules(true)}
            onMouseLeave={() => setHoverRules(false)}
            className="home--container div-home--row--rules"
          >
            <h3> RÈGLES </h3>
            <Fade in={hoverRules}>
              <h5> DU JEU </h5>
            </Fade>
            <div>
              <div className="div-home--row--rules-desc">
                Le jeu est composé de 34 cartes : <br /> 14 cartes trésor (1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15 gemmes) <br /> 15 cartes piège (3 de chaque type : feu, éboulement, momie, serpent et araignée) <br /> 5 cartes relique (artéfact) <br /> Au début du jeu, toutes les cartes trésor et piège sont mélangées ensemble, les cartes reliques (artéfacts) sont mises de côté. A chaque début d'expédition une carte relique (artéfact) est ajoutée au paquet. <br /><br /> Le jeu comporte 5 manches (expéditions). L'aventurier avec le plus de points à la fin de partie gagne : chaque gemme récoltée vaut 1 point et chaque relique (artéfact) vaut 5 points. <br /><br /> Lors du tour d'une expédition, une carte du paquet est révélée <br /> - Si un trésor est révélé, les gemmes sont partagés équitablement entre les joueurs. Les gemmes restantes sont posées sur la carte et attendent la sortie d'un aventurier. <br /> - Si une carte piège est révélée, deux cas sont possibles : <br /> - Si c'est la première carte piège de ce type apparue lors de l'expédition, il ne se passe rien. <br /> - Si c'est la deuxième, l'expédition est ratée. Tous les joueurs encore en jeu rentrent au campement sans butin. <br /> - Si l'expédition n'a pas raté (rappel : deux cartes piège identiques), l'expédition se poursuit et chaque joueur doit décider s'il reste dans l'expédition ou s'il rentre au campement. Les décisions s'effectuent secrètement puis sont révélées simultanément. <br /> <br /> Les aventuriers étant rentrés au campement ne participent plus à l'expédition. Ils récupèrent les gemmes qui étaient restées sur les cartes (celles qui n'avaient pu être partagées équitablement). Si le joueur rentre seul, il peut récupérer les reliques (artefacts) révélés. Puis, il met ses gemmes dans son coffre, elles sont protégées et ne peuvent plus être perdues. <br /><br /> L'expédition continue jusqu'à ce que tous les joueurs soient rentrés ou s'arrête dès que deux cartes piège identiques apparaissent. Si l'expédition s'est arrêtée à cause de deux cartes piège identiques, l'une des cartes piège identiques est retirée du paquet de carte. Les cartes reliques (artefacts) restantes dans le paquet sont retirées. <br /><br /> Après 5 expéditions, chaque gemme dans le coffre vaut 1 point, les reliques (artefacts) valent 5 points chacune. Les 2 dernières reliques (artefacts) valent 5 points supplémentaires. Le joueur avec le plus de points gagne. En cas d'égalité le joueur avec le plus de reliques (artéfacts) gagne.
              </div>
            </div>
          </div>
        </div>
        <div className="div-home--row--credits-list">
          <div className="home--container">
            <h3> CRÉDITS </h3>
            <div className="div-home--row--rules-desc">
              Créé et développé par Gajenthran PANCHALINGAMOORTHY.
              </div>
          </div>
          <div className="home--container"> </div>
        </div>
      </div>
    </>
  );
};

export default Home;
