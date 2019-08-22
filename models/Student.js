const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
module.exports = {
  parentFindById: id => {
    const sql =
      "SELECT id,Students_No,Level_Name,Students_Name,Image FROM student WHERE id = ?";
    return db.query(sql, [id]);
  },

  authParentWithUsername: (username,password) => {
    const sql =
      "SELECT id,Students_No,Level_Name,Students_Name,Image FROM student WHERE Index_No = ? AND Password = ? ";
    return db.query(sql, [username,password]);
  }


};
