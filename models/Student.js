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
const _ = require("lodash");
const {
  noDataFormat,
  showData,
  classTeacherFormat,
  messageDataFormat
} = require("../utils/formatResource");
const {
  FORMAT_TYPE,
  TABLE_ASSIGNMENT_IMAGE,
  TABLE_ASSIGNMENT_PDF,
  TABLE_REPORT_PDF,
  TABLE_REPORT_IMAGE
} = require("../utils/constants");

module.exports = {
  //#region student message

  //
  // ─── MESSAGES ───────────────────────────────────────────────────────────────────
  //

  studentMessage: (req, res, level) => {
    const sql = `SELECT 
        id, Message_BY, M_Date, Message, Message_Level, M_Read
        FROM message WHERE Message_Level = ? ORDER BY M_Date DESC `;
    db.query(sql, [level])
      .then(data => {
        if (_.isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        res.send(showData(data));
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
        sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?`;
        getAssignmentType(req, res, sql, ref);
        break;
      case FORMAT_TYPE.IMAGE:
        table = TABLE_ASSIGNMENT_IMAGE;
        sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?`;
        getAssignmentType(req, res, sql, ref);
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
        Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?`;
        getReportType(req, res, sql, ref);
        break;
      case FORMAT_TYPE.IMAGE:
        table = TABLE_REPORT_IMAGE;
        sql = `SELECT 
        Students_Name,
        Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?`;
        getReportType(req, res, sql, ref);
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
    const sql = `SELECT Teachers_No, Teachers_Name, Gender, Contact, Image FROM teachers WHERE Level_Name = ?`;
    db.query(sql, [level])
      .then(data => {
        if (_.isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = classTeacherFormat(data);
        res.send(showData(_data));
      })
      .catch(err => console.error(err));

    //#endregion
  },

  studentAnnouncement: (req, res, level) => {
    const sql = `SELECT 
    id, Message_BY, M_Date, Message, Message_Level, M_Read
    FROM message WHERE Message_Level = ? ORDER BY M_Date DESC`;
    db.query(sql, [level])
      .then(data => {
        if (_.isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        const _data = messageDataFormat(data);
        res.send(showData(_data));
      })
      .catch(err => console.error(err));
  }
};

//#region Functions
//
// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
//

//#region function for assignment
const getAssignmentType = (req, res, sql, ref) => {
  db.query(sql, [ref])
    .then(data => {
      if (_.isEmpty(data)) {
        res.send(noDataFormat());
        return;
      }
      res.send(showData(data));
    })
    .catch(err => console.error(err));
};
//#endregion

//#region function for report
const getReportType = (req, res, sql, ref) => {
  db.query(sql, [ref])
    .then(data => {
      if (_.isEmpty(data)) {
        res.send(noDataFormat());
        return;
      }
      res.send(showData(data));
    })
    .catch(err => console.error(err));
};

//#endregion

//#endregion
