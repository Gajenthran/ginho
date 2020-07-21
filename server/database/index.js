const mysql = require('mysql');

var config = {};
if (process.env.NODE_ENV === 'production') {
  config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
  };
} else {
  config = {
    user: process.env.DEV_SQL_USER,
    password: process.env.DEV_SQL_PASSWORD,
    database: process.env.DEV_SQL_DATABASE,
    host: process.env.DEV_SQL_HOST,
    port: process.env.DEV_SQL_PORT,
  };
}

class Database {
  constructor() {
    if (
      process.env.INSTANCE_CONNECTION_NAME &&
      process.env.NODE_ENV === 'production'
    ) {
      config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
      config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
    }

    this._con = mysql.createConnection(config);

    this._con.connect((err) => {
      if (err) throw err;
    });
  }

  query(query, ...args) {
    const params = args.length === 2 ? args[0] : [];
    const callback = args.length === 1 ? args[0] : args[1];

    this._con.query(query, params, (err, res) => {
      if (err) {
        console.log(err.stack);
        return callback({ error: 'Database error.' }, null);
      }
      callback({}, res);
    });
  }

  end() {
    this._con.end((err) => {
      if (err) throw err;
    });
  }
}

module.exports = new Database();