/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 14:27:40
 * @modify date 2019-09-11 16:07:08
 * @desc [Message model]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const { TABLE_MESSAGE } = require("../../common/constants");
const db = require("../../config/database");

class MessageModel {
  //
  // ─── GET TYPE MESSAGE ───────────────────────────────────────────────────────────
  //

  static getMessage(from, cb = (err, msg) => {}) {
    let sql = `SELECT id, Message_BY, M_Date, Message, Message_Level, M_Read
         FROM ${TABLE_MESSAGE} WHERE Message_Level = ? ORDER BY M_Date DESC`;

    db.query(sql, [from])
      .then(msg => {
        return cb(null, msg);
      })
      .catch(err => {
        return cb(err);
      });
  }
}

module.exports = MessageModel;
