const db = require('../database');
// const async = require("async");

class Lobby {

  static findByKey(secretKey, callback) {
    db.query(
      `SELECT * FROM lobby WHERE secret_key = ?`,
      [secretKey],
      (err, lobby) => {
        if (err.error)
          return callback(err);
        return callback(null, lobby.length !== 0 ? lobby : false);
      }
    )
  }

  static findByEmail(email, callback) {
    db.query(
      `SELECT * FROM lobby WHERE email = ?`,
      [email],
      (err, lobby) => {
        if (err.error)
          return callback(err);
        return callback(null, lobby);
      }
    )
  }

  static create(data, callback) {
    db.query(
      `INSERT INTO lobby(creator, email, secret_key)
       VALUES(?, ?, ?)
      `,
      [data.firstName, data.email, data.secretKey],
      (err) => {
        if (err.error)
          return callback(err);
        return callback(null);
      }
    );
  }
}

module.exports = Lobby;