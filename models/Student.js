const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const _ = require("lodash");
const { noDataFormat, showData } = require("../utils/formatResource");
const {
  ASSIGNMENT_TYPE,
  TABLE_ASSIGNMENT_IMAGE,
  TABLE_ASSIGNMENT_PDF
} = require("../utils/constants");

module.exports = {
  //#region student message
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
  studentAssignment: (req, res, type, ref) => {
    let sql = "";
    let table = "";
    switch (type) {
      case ASSIGNMENT_TYPE.PDF:
        table = TABLE_ASSIGNMENT_PDF;
        sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?`;
        getAssignmentType(req, res, sql, ref);
        break;
      case ASSIGNMENT_TYPE.IMAGE:
        table = TABLE_ASSIGNMENT_IMAGE;
        sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date FROM ${table} WHERE Students_No = ?`;
        getAssignmentType(req, res, sql, ref);
        break;

      default:
        break;
    }
  }

  //#endregion
};

//#region Functions

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

//#endregion
