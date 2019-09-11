/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 18:09:07
 * @modify date 2019-09-11 18:09:07
 * @desc [file model]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const db = require("../../config/database");
const {
  TABLE_CIRCULAR,
  TABLE_BILLING,
  TABLE_ASSIGNMENT_IMAGE,
  TABLE_ASSIGNMENT_PDF,
  TABLE_REPORT_PDF,
  TABLE_REPORT_IMAGE,
  TABLE_TIME_TABLE
} = require("../../common/constants");
class FileModel {
  static getFile({ from, fileTable, column }, cb = (err, files) => {}) {
    let sql = `SELECT Students_Name,Teachers_Email, Report_File, Report_Date 
              FROM ${fileTable.table} WHERE ${column} = ? ORDER BY Report_Date DESC`;
    let type;

    switch (fileTable.table) {
      case TABLE_CIRCULAR:
        type = "circular";
        sql = `SELECT Faculty_Name FROM ${fileTable.table} WHERE id = ? LIMIT 1`;
        break;

      case TABLE_BILLING:
        type = "bill";
        sql = `SELECT id, Students_No, Students_Name, Uploader, Bill_File, Report_Date 
                FROM ${fileTable.table} WHERE Students_No = ? ORDER BY Report_Date DESC`;
        break;

      case TABLE_ASSIGNMENT_IMAGE:
      case TABLE_ASSIGNMENT_PDF:
        type = "assignment";
        break;

      case TABLE_REPORT_PDF:
      case TABLE_REPORT_IMAGE:
        type = "report";
        break;
      case TABLE_TIME_TABLE:
        type = "timetable";
        sql = "";
        break;
    }

    db.query(sql, [from])
      .then(data => {
        return cb(null, { type: type, data: data, format: fileTable.format });
      })
      .catch(err => {
        return cb(err);
      });
  }
}

module.exports = FileModel;
