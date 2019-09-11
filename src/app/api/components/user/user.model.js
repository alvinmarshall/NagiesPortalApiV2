/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 13:34:41
 * @desc users model
 */
//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const db = require("../../config/database");
const {
  USER_ROLE,
  TABLE_STUDENT,
  TABLE_TEACHER
} = require("../../common/constants");
const { stringToBoolean } = require("../../common/utils/stringToBoolean");

class UserModel {
  //
  // ─── GET USER INFO USING EMAIL AND PASSWORD ─────────────────────────────────────
  //

  findOne(role, { username, password }, cb = (err, user) => {}) {
    let sql;
    if (role === USER_ROLE.Parent) {
      sql = `SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image FROM ${TABLE_STUDENT} WHERE Index_No = ? AND Password = ? LIMIT 1 `;
    }
    if (role === USER_ROLE.Teacher) {
      sql = `SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image FROM ${TABLE_TEACHER} WHERE Username = ? AND Password = ? LIMIT 1 `;
    }
    db.query(sql, [username, password])
      .then(user => {
        if (!user[0]) {
          return cb({ message: "username or password invalid", status: 401 });
        }
        return cb(null, user[0]);
      })
      .catch(err => {
        return cb({ error: err, status: 500 });
      });
  }

  //
  // ─── GET USER INFORMATION USING ID ──────────────────────────────────────────────
  //

  findById(role, { id, isProfile = false }, cb = (err, user) => {}) {
    let sql;
    switch (isProfile) {
      case true:
        if (role === USER_ROLE.Parent) {
          sql = `SELECT * FROM ${TABLE_STUDENT} WHERE id = ?`;
        }
        if (role === USER_ROLE.Teacher) {
          sql = `SELECT id, Teachers_No, Teachers_Name, Dob, Gender, Contact, Admin_Date, Faculty_Name, Level_Name, Username, Image FROM ${TABLE_TEACHER} WHERE id = ?`;
        }
        break;
      default:
        if (role === USER_ROLE.Parent) {
          sql = `SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image FROM ${TABLE_STUDENT} WHERE id = ? LIMIT 1`;
        }
        if (role === USER_ROLE.Teacher) {
          sql = `SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image FROM ${TABLE_TEACHER} WHERE id = ? LIMIT 1`;
        }
        break;
    }

    db.query(sql, [id])
      .then(user => {
        return cb(null, user[0]);
      })
      .catch(err => {
        return cb(err);
      });
  }

  //
  // ─── CHANGE ACCOUNT PASSWORD ────────────────────────────────────────────────────
  //

  changePassword(role, { _id, _old, _confirm }, cb = (err, row) => {}) {
    const table = role == USER_ROLE.Parent ? TABLE_STUDENT : TABLE_TEACHER;
    let sql = `SELECT IF ( COUNT(*) > 0,'true','false') AS exist  FROM ${table} WHERE id = ? AND Password = ?`;
    db.query(sql, [_id, _old])
      .then(data => {
        return stringToBoolean(data[0].exist);
      })
      .then(isValid => {
        if (!isValid) {
          return cb({ message: "username or password invalid", status: 401 });
        }
        sql = `UPDATE ${table} SET Password = ? WHERE id = ?`;
        db.query(sql, [_confirm, _id])
          .then(row => {
            if (row.affectedRows > 0) {
              return cb(null, {
                message: "user password updated",
                status: 200
              });
            }
            return cb(null, {
              message: "change password failded",
              status: 304
            });
          })
          .catch(err => {
            return cb({ errors: err, status: 500 });
          });
      })
      .catch(err => {
        return cb({ errors: err, status: 500 });
      });
  }
}
module.exports = new UserModel();
