import React, { useState } from "react";
import socket from './../../config/socket';

import './Chat.css';
import { Fade } from "react-bootstrap";

import greenButtonImg from './../../assets/img/greenbutton.png'

const Chat = ({ location, name, room, users }) => {
  // const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([]);
  const [hoverRules, setHoverRules] = useState(false);
  const [hoverUsers, setHoverUsers] = useState(false);

  /* useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('send-message', message, () => setMessage(''));
    }
  } */

  const startGame = (event) => {
    event.preventDefault();

    socket.emit('start-game');
  };

  const renderUsers = () => {
    return (
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
    );
  }
  return (
    <div className="div-lobby">
      <div className="lobby--container lobby-title">
        <h3> {room} </h3>
      </div>
      <div className="div-lobby--row">
        <div onMouseEnter={() => setHoverRules(true)} onMouseLeave={() => setHoverRules(false)} className="lobby--container lobby-users-chat">
          <h3> RÈGLES </h3>
          <Fade in={hoverRules}>
            <h5> DU JEU </h5>
          </Fade>
          Le jeu est composé de 34 cartes : <br /> 14 cartes trésor (1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15 gemmes) <br /> 15 cartes piège (3 de chaque type : feu, éboulement, momie, serpent et araignée) <br /> 5 cartes relique (artéfact) <br /> Au début du jeu, toutes les cartes trésor et piège sont mélangées ensemble, les cartes reliques (artéfacts) sont mises de côté. A chaque début d'expédition une carte relique (artéfact) est ajoutée au paquet. <br /><br /> Le jeu comporte 5 manches (expéditions). L'aventurier avec le plus de points à la fin de partie gagne : chaque gemme récoltée vaut 1 point et chaque relique (artéfact) vaut 5 points. <br /><br /> Lors du tour d'une expédition, une carte du paquet est révélée <br /> - Si un trésor est révélé, les gemmes sont partagés équitablement entre les joueurs. Les gemmes restantes sont posées sur la carte et attendent la sortie d'un aventurier. <br /> - Si une carte piège est révélée, deux cas sont possibles : <br /> - Si c'est la première carte piège de ce type apparue lors de l'expédition, il ne se passe rien. <br /> - Si c'est la deuxième, l'expédition est ratée. Tous les joueurs encore en jeu rentrent au campement sans butin. <br /> - Si l'expédition n'a pas raté (rappel : deux cartes piège identiques), l'expédition se poursuit et chaque joueur doit décider s'il reste dans l'expédition ou s'il rentre au campement. Les décisions s'effectuent secrètement puis sont révélées simultanément. <br /> <br /> Les aventuriers étant rentrés au campement ne participent plus à l'expédition. Ils récupèrent les gemmes qui étaient restées sur les cartes (celles qui n'avaient pu être partagées équitablement). Si le joueur rentre seul, il peut récupérer les reliques (artefacts) révélés. Puis, il met ses gemmes dans son coffre, elles sont protégées et ne peuvent plus être perdues. <br /><br /> L'expédition continue jusqu'à ce que tous les joueurs soient rentrés ou s'arrête dès que deux cartes piège identiques apparaissent. Si l'expédition s'est arrêtée à cause de deux cartes piège identiques, l'une des cartes piège identiques est retirée du paquet de carte. Les cartes reliques (artefacts) restantes dans le paquet sont retirées. <br /><br /> Après 5 expéditions, chaque gemme dans le coffre vaut 1 point, les reliques (artefacts) valent 5 points chacune. Les 2 dernières reliques (artefacts) valent 5 points supplémentaires. Le joueur avec le plus de points gagne. En cas d'égalité le joueur avec le plus de reliques (artéfacts) gagne.
        </div>

        <div onMouseEnter={() => setHoverUsers(true)} onMouseLeave={() => setHoverUsers(false)} className="lobby--container lobby-users-list">
          <h3> JOUEURS</h3>
          <Fade in={hoverUsers}>
            <h5> ({users.length}) </h5>
          </Fade>
          {renderUsers()}
        </div>
      </div>

      <div onClick={e => startGame(e)} className="lobby--container lobby-start-game">
        LANCER LA PARTIE
      </div>
    </div>
  );
}

export default Chat;
