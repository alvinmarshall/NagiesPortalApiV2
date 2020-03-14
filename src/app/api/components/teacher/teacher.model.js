/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-12 23:16:40
 * @modify date 2019-09-12 23:16:40
 * @desc [teacher model]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const db = require("../../config/database");

class TeacherModel {
  //
  // ─── FIND CLASS STUDENT ─────────────────────────────────────────────────────────
  //

  static findStudent(level, cb = (err, student) => {}) {
    const sql = `SELECT id,Students_No,Students_Name,Gender,Index_No,Image FROM student WHERE Level_Name =  ?`;
    db.query(sql, [level])
      .then(student => cb(null, student))
      .catch(err => cb(err));
  }
}
module.exports = TeacherModel;
