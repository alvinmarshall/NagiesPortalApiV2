/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 19:01:28
 * @modify date 2019-08-23 19:01:28
 * @desc mysql wrapped with promise
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const mysql = require("mysql");
//
// ─── MYSQL DATABASE CONNECTION ───────────────────────────────────────────────────────────────────
//

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = Database;
