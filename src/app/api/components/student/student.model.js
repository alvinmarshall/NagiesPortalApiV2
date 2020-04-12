/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 13:00:53
 * @modify date 2019-09-11 13:00:53
 * @desc [Student Model]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const db = require("../../config/database");
const { TABLE_TEACHER } = require("../../common/constants");
class StudentModel {
  static findTeacherAsync(user) {
    const sql = `SELECT id,Teachers_No, Teachers_Name, Gender, Contact, Image FROM ${TABLE_TEACHER} WHERE Level_Name = ?`;
    return db.query(sql, [user.level])
  }
}
module.exports = StudentModel;
