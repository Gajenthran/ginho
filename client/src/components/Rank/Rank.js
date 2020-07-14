import React, { useEffect } from 'react';

import orImg from './../../assets/img/or.png'
import argentImg from './../../assets/img/argent.png'
import bronzeImg from './../../assets/img/bronze.png'
import goldImg from './../../assets/img/gold.png'

import './Rank.css';

const Rank = ({ socket, users }) => {

  const handleRestart = (event) => {
    event.preventDefault();

    socket.emit('restart-game');
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="div-ranking">
      <div className="div-ranking-title">
        <h3> Classement</h3>
      </div>
      <div className="ranking--users-list">
        {users.map((user, index) =>
          index === 0 ?
            <div key={user.id} className="ranking-user">
              <div> <img src={orImg} alt="or" /> </div>
              <div> {user.name} </div>
              <div className="ranking-user-gold"> <img src={goldImg} alt="gold"/> <span> {user.gold} </span> </div>
            </div>
            : index === 1 ?
              <div key={user.id} className="ranking-user">
                <div> <img src={argentImg} alt="argent" /> </div>
                <div> {user.name} </div>
                <div className="ranking-user-gold"> <img src={goldImg} alt="gold" /> <span> {user.gold} </span> </div>
              </div>
              : index === 2 ?
                <div key={user.id} className="ranking-user">
                  <div> <img src={bronzeImg} alt="bronze" /> </div>
                  <div> {user.name} </div>
                  <div className="ranking-user-gold"> <img src={goldImg} alt="gold" /> <span> {user.gold} </span> </div>
                </div>
                :
                <div className="ranking-user">
                  <div> </div>
                  <div> {user.name} </div>
                  <div className="ranking-user-gold"> <img src={goldImg} alt="gold" /> <span> {user.gold} </span> </div>
                </div>
        )}
      </div>
      <button onClick={e => handleRestart(e)}> RECOMMENCER </button>
    </div>
  );
};

export default Rank;