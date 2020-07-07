const Lobby = require('../../models/lobby');
const bcrypt = require('bcrypt');
// const userMail = require('./mail');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');
// const pass_generator = require('generate-password');
// const passport = require('passport');
// const crypto = require('crypto'); 

class LobbyController {
  static join(req, res) {
    const { secretKey } = req.body;
    const { firstName, email } = req.user;

    Lobby.findByKey(secretKey, (err, lobby) => {
      if (err)
        return res.json({
          status: 404,
          message: err
        });

      return res.json({
        status: 200,
        message: 'Joining the lobby...',
        lobby: lobby,
        user: { firstName, email }
      })
    });
  }

  static create(req, res) {
    const { firstName, email } = req.user;
    var data = {};
    bcrypt.hash(email, 10, (err, hash) => {
      if (err) {
        return res.json({
          status: 404,
          message: err
        });
      }

      data.secretKey = hash;
      data.firstName = firstName;
      data.email = email;

      Lobby.findByEmail(email, (err, lobby) => {
        if (err) {
          return res.json({
            status: 404,
            message: err
          });
        } else if (lobby && lobby.length != 0) {
          return res.json({
            status: 200,
            message: 'OK. Lobby already created.',
            data: data
          });
        } else {
          Lobby.create(data, (err) => {
            if (err)
              return res.json({
                status: 404,
                message: err
              });
            return res.json({
              status: 200,
              message: 'OK. Lobby created.',
              data: data
            });
          });
        }
      });
    });
  }
}

module.exports = LobbyController;