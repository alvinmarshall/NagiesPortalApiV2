const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const { isEmpty } = require("lodash");
const { TABLE_COMPLAINTS, TABLE_MESSAGE } = require("../utils/constants");
const {
  noDataFormat,
  complaintDataFormat,
  showData,
  messageDataFormat
} = require("../utils/formatResource");
const { uploadFile } = require("../utils/fileUtil");
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
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = complaintDataFormat(data);
        res.send(showData(_data));
      })
      .catch(err => console.error(err));
  },
  //#endregion

  //#region announcement messages

  //
  // ─── TEACHER ANNNOUNCMENT MESSAGE ───────────────────────────────────────────────
  //

  teacherAnnouncement: (req, res, from = "administrator") => {
    const sql = `SELECT 
      id, Message_BY, M_Date, Message, Message_Level, M_Read
      FROM ${TABLE_MESSAGE} WHERE Message_Level = ? ORDER BY M_Date DESC`;
    db.query(sql, [from])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = messageDataFormat(data);
        res.send(showData(_data));
      })
      .catch(err => console.error(err));
  },
  //#endregion

  //#region teacher upload

  //
  // ─── TEACHER UPLOADS ────────────────────────────────────────────────────────────
  //

  teacherUpload: (req, res, dbTable, user) => {
    uploadFile(req, res, dbTable, user);
  }
  //#endregion
};

//#region Functions
//#endregion
