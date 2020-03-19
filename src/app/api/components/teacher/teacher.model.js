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
const { TABLE_REGISTER } = require("../../common/constants");
const Firebase = require("../notification/firebase.service");
const { firebaseTopicPayload } = require("../../common/utils/data.format");
const { FIREBASE_TOPIC } = require("../../common/constants");
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

  //
  // ─── SET CLASS REGISTER ─────────────────────────────────────────────────────────
  //

  static setClassRegisterAsync(data) {
    return new Promise((resolve, reject) => {
      try {
        const sql = `INSERT INTO ${TABLE_REGISTER} (Ref,Name,Status) VALUES (?,?,?)`;
        data.map(async d => {
          const { ref, name, status } = d;
          await db.query(sql, [ref, name, status]);
          const title = "Today's class register";
          let statusName = ref === "1" ? "Absent" : "Present";
          const body = `${name} is ${statusName} today in class.`;
          const _data = { name, type: "message" };

          let payload = firebaseTopicPayload({ title, body, data: _data });
          await Firebase.sendTopicMessageAsync({
            topic: FIREBASE_TOPIC.Parent,
            payload
          });
        });
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = TeacherModel;
