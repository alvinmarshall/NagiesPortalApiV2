/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 19:01:28
 * @modify date 2019-09-11 12:55:21
 * @desc mysql wrapped with promise
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const mysql = require("mysql");
const config = require("config");

//
// ───ADD PROMISE TO MYSQL DATABASE CONNECTION ───────────────────────────────────────────────────────────────────
//
class Database {
  constructor() {
    this.connection = mysql.createConnection(config.get("dbConfig"));
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err) return reject(err);
        resolve(results);
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

module.exports = new Database();
