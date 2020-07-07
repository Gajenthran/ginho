const db = require('../database');
// const async = require("async");

class User {
  static add(data, callback) {
    db.query(
      `INSERT INTO user(email, first_name, last_name, image_url)
       VALUES(?, ?, ?, ?)`,
      [data.email, data.firstName, data.lastName, data.picture],
      (err) => {
        if (err.error)
          return callback(err);
        db.query(
          `SELECT * FROM user WHERE email = ?`,
          [data.email],
          (err, res) => {
            if (err.error)
              return callback(err);
            callback(null, res[0]);
          }
        );
      }
    );
  }

  static find(data, callback) {
    db.query(
      `SELECT * FROM user WHERE email = ?`,
      [data.email],
      (err, res) => {
        if (err.error)
          return callback(err);
        
        callback(null, res.length === 0 ? false : res[0])
      }
    );
  }
}

module.exports = User;