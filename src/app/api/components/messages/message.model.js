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
const isEmpty = require("lodash").isEmpty;
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

  //
  // ─── SEND MESSAGE ───────────────────────────────────────────────────────────────
  //
  static sendMessage(
    { to, type, user, messageData },
    cb = (err, result) => {}
  ) {
    let sql, info;

    switch (to) {
      case "parent": // teacher sending this
        sql = `INSERT INTO ${type.table} SET Message_BY = ?, Message = ?,Message_Level = ?`;
        db.query(sql, [user.username, messageData.message, user.level])
          .then(row => {
            if (row.affectedRows === 0) {
              return cb({ message: "message failed", status: 304 });
            }
            return cb(null, {
              message: "message sent",
              status: 200,
              id: row.insertId,
              level: user.level,
              type: {
                title: "message",
                from: "teacher",
                msg: messageData.message
              }
            });
          })
          .catch(err => {
            return cb(err);
          });
        break;
      case "teacher": // parent sending this
        info = `SELECT Guardian_No,Guardian_Name FROM ${type.info} WHERE id = ?`;
        sql = `INSERT INTO ${type.table} SET Students_No = ?, 
                Students_Name = ?, Message = ?,Level_Name = ?,
                Guardian_Name = ?,Guardian_No = ?,Teachers_Name = ?`;
        db.query(info, [user.id])
          .then(_info => {
            return _info[0];
          })
          .then(_info => {
            if (isEmpty(_info))
              return cb({ message: "user not found", status: 404 });
            let params = {
              studentNo: user.ref,
              studentName: user.name,
              teacherName: messageData.teacherName,
              guardianName: _info.Guardian_Name,
              guardianNo: _info.Guardian_No,
              message: messageData.message,
              level: user.level
            };

            db.query(sql, [
              params.studentNo,
              params.studentName,
              params.message,
              params.level,
              params.guardianName,
              params.guardianNo,
              params.teacherName
            ])
              .then(row => {
                if (row.affectedRows === 0)
                  return cb({ message: "message failed", status: 304 });
                return cb(null, {
                  message: "message sent",
                  status: 200,
                  id: row.insertId,
                  type: {
                    title: "complaint",
                    from: "parent",
                    msg: messageData.message
                  }
                });
              })
              .catch(err => {
                return cb(err);
              });
          })
          .catch(err => {
            return cb(err);
          });
        break;
    }
  }
}

module.exports = MessageModel;
