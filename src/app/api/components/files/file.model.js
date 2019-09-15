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
const { uploadFile } = require("./file.util");

class FileModel {
  //
  // ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: G E T   A N Y   F I L E   P A T H   F R O M   S E R V E R : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────────────────────────
  //

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

  //
  // ────────────────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: S A V E   U P L O A D   F I L E   P A T H : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────────
  //

  static saveFilePath(user, uploadInfo, reportInfo, cb = (err, result) => {}) {
    let sql,
      param = {
        studentNo: user.level,
        studentName: user.username,
        teacherEmail: user.username,
        path: uploadInfo.destination
      };
    switch (uploadInfo.fileTable.table) {
      case TABLE_CIRCULAR:
      case TABLE_BILLING:
        break;
      default:
        sql = `INSERT INTO ${uploadInfo.fileTable.table} SET Students_No = ?,Students_Name = ?,Teachers_Email = ?,Report_File = ?`;
        break;
    }

    if (reportInfo) {
      param.studentName = reportInfo.studentName;
      param.studentNo = reportInfo.studentNo;
    }

    db.query(sql, [
      param.studentNo,
      param.studentName,
      param.teacherEmail,
      param.path
    ])
      .then(row => {
        return cb(null, {
          row: row,
          path: param.path,
          format: uploadInfo.fileTable.format
        });
      })
      .catch(err => {
        return cb(err);
      });
  }

  //
  // ──────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: D E L E T E   F I L E   P A T H : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────────
  //
  static deleteFilePath(id, { user, fileTable }, cb = (err, result) => {}) {
    const sql = `DELETE FROM ${fileTable.table} WHERE id = ? AND Teachers_Email = ?`;
    db.query(sql, [id, user.username])
      .then(row => cb(null, row))
      .catch(err => cb(err));
  }
}

module.exports = FileModel;
