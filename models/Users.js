const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
module.exports = {
  //#region Parent auth
  parentFindById: id => {
    const sql =
      "SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image FROM student WHERE id = ? LIMIT 1";
    return db.query(sql, [id]);
  },

  authParentWithUsername: (username, password) => {
    const sql =
      "SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image FROM student WHERE Index_No = ? AND Password = ? LIMIT 1 ";
    return db.query(sql, [username, password]);
  },
  //#endregion

  //#region Teacher auth
  teacherFindById: id => {
    const sql =
      "SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image FROM teachers WHERE id = ? LIMIT 1";
    return db.query(sql, [id]);
  },

  authTeacherWithUsername: (username, password) => {
    const sql =
      "SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image FROM teachers WHERE Username = ? AND Password = ? LIMIT 1 ";
    return db.query(sql, [username, password]);
  }
  //#endregion
};
