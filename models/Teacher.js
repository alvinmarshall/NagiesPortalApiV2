const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const { isEmpty,forEach } = require("lodash");
const {
  TABLE_COMPLAINTS,
  TABLE_MESSAGE,
  FIREBASE_TOPIC,
  TABLE_ASSIGNMENT_PDF,
  TABLE_ASSIGNMENT_IMAGE,
  TABLE_REPORT_PDF,
  TABLE_REPORT_IMAGE,DATE_TYPE
} = require("../utils/constants");
const {
  noDataFormat,
  complaintDataFormat,
  showData,
  messageDataFormat,
  firebaseTopicPayload,
  classStudentDataFormat
} = require("../utils/formatResource");
const { uploadFile, deleteFile } = require("../utils/fileUtil");
const { sendTopicMessage } = require("../notification/firebase");
const dateFormat = require('dateformat')
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
        res.send(showData(_data, "complaints"));
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
        res.send(showData(_data, "messages"));
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
        if (row.affectedRows === 0) {
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
        res.send({
          message: "message sent",
          status: 200,
          id: row.insertId,
          level: user.level
        });
      })
      .catch(err => console.error(err));
  },
  //#endregion

  //#region class students
  //
  // ─── CLASS STUDENTS ─────────────────────────────────────────────────────────────
  //
  classStudents: (req, res, level) => {
    const sql = `SELECT Students_No,Students_Name,Gender,Index_No,Image FROM student WHERE Level_Name =  ?`;
    db.query(sql, [level])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = classStudentDataFormat(data);
        res.send(showData(_data, "classStudent"));
      })
      .catch(err => console.error(err));
  },

  //#endregion

  //#region delete assignment

  //
  // ─── DELETE ASSIGNMENT ──────────────────────────────────────────────────────────
  //

  deleteUploadPath: (req, res, user) => {
    const { id, path, format, type } = req.query;
    const dbTable = getDbTable(format, type);
    const sql = `DELETE FROM ${dbTable} WHERE id = ?`;
    if (isEmpty(dbTable)) {
      res.status(400).send({ message: "format not supported", status: 400 });
      return;
    }

    db.query(sql, [id])
      .then(row => {
        if (row.affectedRows === 0) {
          res.status(404).send(noDataFormat());
          return;
        }
        deleteFile(req, res, path);
      })
      .catch(err => console.error(err));
  },
  //#endregion

  //#region uploaded assignment

  getUploadedFilePath: (req, res, user) => {
    const { format, type } = req.query;
    console.log(`format: ${format} type: ${type}`);
    const dbTable = getDbTable(format, type);
    const sql = `SELECT * FROM ${dbTable} WHERE Teachers_Email = ? ORDER BY Report_Date DESC`;
    db.query(sql, [user.username])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        forEach(data,(_,key) => {
          data[key].Report_Date = dateFormat(data[key].Report_Date,DATE_TYPE.fullDate)
        })
        res.send(showData(data, "dataUpload"));
      })
      .catch(err => console.error(err));
  }
  //#endregion
};

//#region Functions
//#endregion

const getDbTable = (format, type) => {
  switch (format) {
    case "pdf":
      if (type === "assignment") {
        return TABLE_ASSIGNMENT_PDF;
      }
      return TABLE_REPORT_PDF;

    case "image":
      if (type === "report") {
        return TABLE_REPORT_IMAGE;
      }
      return TABLE_ASSIGNMENT_IMAGE;

    default:
      return undefined;
  }
};
