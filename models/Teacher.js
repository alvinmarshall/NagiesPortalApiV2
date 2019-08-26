const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const { isEmpty } = require("lodash");
const {
  TABLE_COMPLAINTS,
  TABLE_MESSAGE,
  FIREBASE_TOPIC
} = require("../utils/constants");
const {
  noDataFormat,
  complaintDataFormat,
  showData,
  messageDataFormat,
  firebaseTopicPayload
} = require("../utils/formatResource");
const { uploadFile } = require("../utils/fileUtil");
const { sendTopicMessage } = require("../notification/firebase");
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
  },
  //#endregion

  //#region send message to parent

  //
  // ─── SEND MESSAGE TO PARENT ─────────────────────────────────────────────────────
  //

  sendMessageToParent: (req, res, user) => {
    const sql = `INSERT INTO message SET Message_BY = ?, Message = ?,Message_Level = ?`;
    db.query(sql, [user.username, req.body.message, user.level])
      .then(row => {
        if (isEmpty(row)) {
          res.status(500).send({ message: "message failed", status: 500 });
          return;
        }
        const message = firebaseTopicPayload(
          "message from teacher",
          req.body.message,
          FIREBASE_TOPIC.Parent
        );

        sendTopicMessage(message)
          .then(response => {
            console.log(`firebase message success ${response}`);
          })
          .catch(err => console.error(err));
        res.send({ message: "message sent", status: 200, id: row.insertId });
      })
      .catch(err => console.error(err));
  }
  //#endregion
};

//#region Functions
//#endregion
