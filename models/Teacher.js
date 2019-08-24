const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const _ = require("lodash");
const { TABLE_COMPLAINTS, TABLE_MESSAGE } = require("../utils/constants");
const {
  noDataFormat,
  complaintDataFormat,
  showData
} = require("../utils/formatResource");
module.exports = {
  //#region parrent complaint

  //
  // ─── TEACHER COMPLAINT MESSAGE ──────────────────────────────────────────────────
  //

  parentComplaints: (req, res, level) => {
    const sql = `SELECT  id, Students_No, Students_Name,Level_Name,Guardian_Name,Guardian_No, 
            Teachers_Name,Message,Message_Date FROM ${TABLE_COMPLAINTS}
            where Level_Name = ? ORDER BY Message_Date DESC`;
    db.query(sql, [level])
      .then(data => {
        if (_.isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = complaintDataFormat(data);
        res.send(showData(_data));
      })
      .catch(err => console.error(err));
  }
  //#endregion
};
