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
  TABLE_TIME_TABLE,
  TABLE_TEACHER,
  TABLE_RECEIPT,
  getCommonDateStyle
} = require("../../common/constants");
const Firebase = require("../notification/firebase.service");
const { firebaseTopicPayload } = require("../../common/utils/data.format");
class FileModel {
  //
  // ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: G E T   A N Y   F I L E   P A T H   F R O M   S E R V E R : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────────────────────────
  //

  static getFile({ from, fileTable, column }, cb = (err, files) => {}) {
    let sql = `SELECT id,Students_No,Students_Name,Teachers_Email, Report_File, Report_Date 
              FROM ${fileTable.table} WHERE ${column} = ? ORDER BY id DESC`;
    let type;

    switch (fileTable.table) {
      case TABLE_CIRCULAR:
        type = "circular";
        sql = `SELECT id,CID,FileName,CID_Date FROM ${fileTable.table} WHERE Faculty_Name = ? ORDER BY CID_Date DESC `;
        break;

      case TABLE_BILLING:
        type = "bill";
        sql = `SELECT id, Students_No, Students_Name, Uploader, Bill_File, Report_Date 
                FROM ${fileTable.table} WHERE Students_No = ? ORDER BY id DESC`;
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
      case TABLE_RECEIPT:
      
        const sql2 = `
          INSERT 
          INTO ${uploadInfo.fileTable.table}
          SET
          Ref_No = ?,
          Name = ?,
          Level = ?,
          Image = ?,
          Date = ?      `;
        return this.uploadReceipt(user, sql2,param)
          .then(row => {
            cb(null, {
              row: row,
              path: param.path,
              format: uploadInfo.fileTable.format
            });
          })
          .catch(err => cb(err));

        break;
      default:
        sql = `
        INSERT INTO ${uploadInfo.fileTable.table} 
        SET Students_No = ?,
        Students_Name = ?,
        Teachers_Email = ?,
        Report_File = ?`;
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
      .then(async row => {
        const date = getCommonDateStyle();
        const sql = `UPDATE ${TABLE_TEACHER} SET Dob = ? WHERE Username = ?`;
        await db.query(sql, [date, param.studentName]);
        let payload,
          topic = "parent",
          title,
          body,
          data = {};
        if (reportInfo) {
          let firstname = reportInfo.studentName.split(" ")[0];
          title = `${firstname} Terminal Report file`;
          body = `The end of term report file for ${reportInfo.studentName}`;
          data.type = `report_${uploadInfo.fileTable.format}`;
          data.name = reportInfo.studentName;
          payload = firebaseTopicPayload({ title, body, data });
        } else {
          title = "Assignment from class teacher";
          body = `${user.name} has uploaded an assignment for ${user.level} class.`;
          data.type = `assignment_${uploadInfo.fileTable.format}`;
          data.level = user.level;
          payload = firebaseTopicPayload({ title, body, data });
        }

        Firebase.sendTopicMessage({ topic, payload }, (err, res) => {
          if (err) return console.error(err);
          return console.log(res);
        });

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
