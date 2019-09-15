/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:37:27
 * @modify date 2019-08-23 18:37:27
 * @desc student model
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const { isEmpty } = require("lodash");
const {
  noDataFormat,
  showData,
  classTeacherFormat,
  messageDataFormat,
  circularFormat,
  fileDataFormat,
  billDataFormat,
  firebaseTopicPayload
} = require("../utils/formatResource");
const {
  FORMAT_TYPE,
  TABLE_ASSIGNMENT_IMAGE,
  TABLE_ASSIGNMENT_PDF,
  TABLE_REPORT_PDF,
  TABLE_REPORT_IMAGE,
  TABLE_STUDENT,
  TABLE_ANNOUNCEMENT,
  TABLE_CIRCULAR,
  TABLE_TEACHER,
  TABLE_MESSAGE,
  TABLE_BILLING,
  TABLE_TIME_TABLE,
  FIREBASE_TOPIC
} = require("../utils/constants");

const { complaintFieldValidation } = require("../utils/validation.js");
const { sendTopicMessage } = require("../notification/firebase");

module.exports = {
  //#region student message

  //
  // ─── MESSAGES ───────────────────────────────────────────────────────────────────
  //

  studentMessage: (req, res, level) => {
    const sql = `SELECT 
        id, Message_BY, M_Date, Message, Message_Level, M_Read
        FROM ${TABLE_MESSAGE} WHERE Message_Level = ? ORDER BY M_Date DESC `;
    db.query(sql, [level])
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

  //#region student assignment
  //
  // ─── ASSSIGNMENT ────────────────────────────────────────────────────────────────
  // NOTE Student_No from assignment table is actually level not ref
  //

  studentAssignment: (req, res, type, ref) => {
    let sql = "";
    let table = "";
    switch (type) {
      case FORMAT_TYPE.PDF:
        table = TABLE_ASSIGNMENT_PDF;
        sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ? ORDER BY Report_Date DESC`;
        getAssignmentType(req, res, sql, ref, FORMAT_TYPE.PDF);
        break;
      case FORMAT_TYPE.IMAGE:
        table = TABLE_ASSIGNMENT_IMAGE;
        sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?  ORDER BY Report_Date DESC`;
        getAssignmentType(req, res, sql, ref, FORMAT_TYPE.IMAGE);
        break;

      default:
        break;
    }
  },
  //#endregion

  //#region student report

  //
  // ─── REPORT ─────────────────────────────────────────────────────────────────────
  //

  studentReport: (req, res, type, ref) => {
    let sql = "";
    let table = "";
    switch (type) {
      case FORMAT_TYPE.PDF:
        table = TABLE_REPORT_PDF;
        sql = `SELECT 
        Students_Name,
        Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ? ORDER BY Report_Date DESC`;
        getReportType(req, res, sql, ref, FORMAT_TYPE.PDF);
        break;
      case FORMAT_TYPE.IMAGE:
        table = TABLE_REPORT_IMAGE;
        sql = `SELECT 
        Students_Name,
        Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?  ORDER BY Report_Date DESC`;
        getReportType(req, res, sql, ref, FORMAT_TYPE.IMAGE);
        break;

      default:
        break;
    }
  },
  //#endregion

  //#region class teacher

  //
  // ─── CLASS TEACHER ──────────────────────────────────────────────────────────────
  //
  classTeacher: (req, res, level) => {
    const sql = `SELECT Teachers_No, Teachers_Name, Gender, Contact, Image FROM ${TABLE_TEACHER} WHERE Level_Name = ?`;
    db.query(sql, [level])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = classTeacherFormat(data);
        res.send(showData(_data, "studentTeachers"));
      })
      .catch(err => console.error(err));

    //#endregion
  },

  //#region student announcement

  //
  // ─── STUDENT ANNOUNCEMENT ───────────────────────────────────────────────────────
  //

  studentAnnouncement: (req, res) => {
    const sql = `SELECT 
    id, Message_BY, M_Date, Message, Message_Level, M_Read
    FROM ${TABLE_ANNOUNCEMENT} WHERE Message_Level = ? ORDER BY M_Date DESC`;
    const level = "administrator";
    db.query(sql, [level])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = messageDataFormat(data);
        res.send(showData(_data, "messages"));
      })
      .catch(err => console.error(err));

    //#endregion
  },

  //#region Circular

  //
  // ─── CIRCULAR ───────────────────────────────────────────────────────────────────
  //

  circular: (req, res, id) => {
    let sql = `SELECT Faculty_Name FROM ${TABLE_STUDENT} WHERE id = ? LIMIT 1`;

    db.query(sql, [id])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const faculty = data[0].Faculty_Name;
        sql = `SELECT id,CID,FileName,CID_Date FROM ${TABLE_CIRCULAR} WHERE Faculty_Name = ? ORDER BY CID_Date DESC `;
        db.query(sql, [faculty])
          .then(data => {
            if (isEmpty(data)) {
              res.status(404).send(noDataFormat());
              return;
            }
            const _data = circularFormat(data);
            res.send(showData(_data, "Circular"));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  },
  //#endregion

  //#region student bills
  //
  // ─── STUDENT BILLS ──────────────────────────────────────────────────────────────
  //

  studentBills: (req, res, ref) => {
    const sql = `SELECT id, Students_No, Students_Name, Uploader, Bill_File, Report_Date 
      FROM ${TABLE_BILLING} WHERE Students_No = ? ORDER BY Report_Date DESC`;
    db.query(sql, [ref])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = billDataFormat(data);
        res.send(showData(_data, "Billing"));
      })
      .catch(err => console.error(err));
  },
  //#endregion

  //#region send complaint message

  //
  // ─── SEND COMPLAINT MESSAGE TO TEACHER ──────────────────────────────────────────
  //

  sendComplaint: (req, res, user) => {
    complaintFieldValidation(req, (err, messageData) => {
      if (err) {
        res.status(400).send(err);
        return;
      }

      let sql = `SELECT Guardian_No,Guardian_Name FROM ${TABLE_STUDENT} WHERE id = ?`;
      let guardianNo,
        guardianName,
        message,
        teacherName,
        studentNo,
        level,
        studentName;
      db.query(sql, [user.id])
        .then(data => {
          console.log(data);
          return data[0];
        })
        .then(data => {
          if (isEmpty(data)) {
            res.status(404).send({ message: "user not found", status: 404 });
            return;
          }
          studentNo = user.ref;
          studentName = user.name;
          teacherName = messageData.teacherName;
          guardianName = data.Guardian_Name;
          guardianNo = data.Guardian_No;
          message = messageData.message;
          level = user.level;

          sql = `INSERT INTO complaints SET Students_No = ?, 
          Students_Name = ?, Message = ?,Level_Name = ?,
          Guardian_Name = ?,Guardian_No = ?,Teachers_Name = ?`;
          db.query(sql, [
            studentNo,
            studentName,
            message,
            level,
            guardianName,
            guardianNo,
            teacherName
          ])
            .then(row => {
              if (isEmpty(row)) {
                res
                  .status(500)
                  .send({ message: "message failed", status: 500 });
                return;
              }

              const _message = firebaseTopicPayload(
                "complaint from parent",
                message,
                FIREBASE_TOPIC.Teacher
              );

              sendTopicMessage(_message)
                .then(response => {
                  console.log(`firebase message success ${response}`);
                })
                .catch(err => console.error(err));

              res.send({
                message: "message sent",
                status: 200,
                id: row.insertId
              });
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    });
  },
  //#endregion
  //#region  get time table
  //
  // ─── GET CLASS TIME TABLE ───────────────────────────────────────────────────────
  //

  studentTimetable: (req, res, ref) => {
    const sql = `SELECT  
      FROM ${TABLE_TIME_TABLE} WHERE Students_No = ? ORDER BY Report_Date DESC`;
    db.query(sql, [ref])
      .then(data => {
        if (isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = ["timetable"];
        res.send(showData(_data, "timetable"));
      })
      .catch(err => console.error(err));
  }
  //#endregion
};

//#region Functions
//
// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
//

//#region function for assignment
const getAssignmentType = (req, res, sql, ref, type) => {
  db.query(sql, [ref])
    .then(data => {
      if (isEmpty(data)) {
        res.status(404).send(noDataFormat());
        return;
      }
      const _data = fileDataFormat(type, data);
      res.send(showData(_data, "Assignment"));
    })
    .catch(err => console.error(err));
};
//#endregion

//#region function for report
const getReportType = (req, res, sql, ref, type) => {
  db.query(sql, [ref])
    .then(data => {
      if (isEmpty(data)) {
        res.status(404).send(noDataFormat());
        return;
      }
      const _data = fileDataFormat(type, data);
      res.send(showData(_data, "report"));
    })
    .catch(err => console.error(err));
};

//#endregion

//#endregion
