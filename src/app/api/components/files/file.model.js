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
const dateFormat = require("dateformat");
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
  TABLE_VIDEO,
  DATE_TYPE,
  FIREBASE_TOPIC,
  getCommonDateStyle,
} = require("../../common/constants");
const {
  firebaseTopicPayload,
  circularFormat,
  billDataFormat,
  fileDataFormat,
} = require("../../common/utils/data.format");
class FileModel {
  //
  // ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: G E T   A N Y   F I L E   P A T H   F R O M   S E R V E R : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────────────────────────
  //

  static getFileAsync({ from, fileTable, column, paging }) {
    const { table } = fileTable;

    switch (table) {
      case TABLE_CIRCULAR:
        return this.getCircularAsync({ from, paging });

      case TABLE_BILLING:
        return this.getBillAsync({ from, paging });

      case TABLE_ASSIGNMENT_IMAGE:
      case TABLE_ASSIGNMENT_PDF:
        return this.getAssignmentAsync({ column, from, paging });

      case TABLE_REPORT_PDF:
      case TABLE_REPORT_IMAGE:
        return this.getReportAsync({ column, from, paging });

      case TABLE_TIME_TABLE:
        return this.getTimeTableAsync({ column, from, paging });

      default:
        break;
    }
  }

  //#region Circular
  static getCircularAsync({ from, paging }) {
    const { start, end } = paging;
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
        SELECT id,CID,FileName,CID_Date 
        FROM ${TABLE_CIRCULAR} 
        WHERE Faculty_Name = ? ORDER BY CID_Date DESC LIMIT ?,? `;
        const result = await db.query(sql, [from, start, end]);
        const data = circularFormat(result);
        resolve({ data });
      } catch (err) {
        reject(err);
      }
    });
  }
  //#endregion

  //#region Bill
  static getBillAsync({ from, paging }) {
    const { start, end } = paging;
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
          SELECT id, Students_No, Students_Name,
                Uploader, Bill_File, Report_Date 
         FROM ${TABLE_BILLING} 
         WHERE Students_No = ? ORDER BY id DESC LIMIT ?,?`;
        const result = await db.query(sql, [from, start, end]);
        const data = billDataFormat(result);
        resolve({ data });
      } catch (err) {
        reject(err);
      }
    });
  }
  //#endregion

  //#region Assignment
  static getAssignmentAsync({ column, from, paging }) {
    const { start, end } = paging;
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
        SELECT id,Students_No,Students_Name,Teachers_Email, 
        Report_File, Report_Date 
        FROM ${TABLE_ASSIGNMENT_IMAGE} 
        WHERE ${column} = ? ORDER BY id DESC LIMIT ?,?`;
        const result = await db.query(sql, [from, start, end]);
        const data = fileDataFormat("image", result);
        resolve({ data });
      } catch (err) {
        reject(err);
      }
    });
  }
  //#endregion

  //#region Report
  static getReportAsync({ column, from, paging }) {
    const { start, end } = paging;
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
        SELECT id,Students_No,Students_Name,
            Teachers_Email, Report_File, Report_Date 
        FROM ${TABLE_REPORT_IMAGE} 
        WHERE ${column} = ? ORDER BY id DESC LIMIT ?,?`;
        const result = await db.query(sql, [from, start, end]);
        const data = fileDataFormat("image", result);
        resolve({ data });
      } catch (err) {
        reject(err);
      }
    });
  }
  //#endregion

  //#region TimeTable
  static getTimeTableAsync({ column, from, paging }) {
    const { start, end } = paging;
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
        SELECT id,Students_No,Students_Name,Teachers_Email, 
              Report_File, Report_Date 
        FROM ${TABLE_TIME_TABLE} 
        WHERE ${column} = ? ORDER BY id DESC LIMIT ?,?`;
        const result = await db.query(sql, [from, start, end]);
        const data = fileDataFormat("image", result);
        resolve({ data });
      } catch (err) {
        reject(err);
      }
    });
  }
  //#endregion

  //
  // ────────────────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: S A V E   U P L O A D   F I L E   P A T H : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────────────────────
  //

  static saveFilePathAsync(user, uploadInfo, reportInfo) {
    switch (uploadInfo.fileTable.table) {
      case TABLE_ASSIGNMENT_IMAGE:
        return this.saveAssignmentPathAsync({ user, uploadInfo });
      case TABLE_REPORT_IMAGE:
        return this.saveReportPathAsync({ user, reportInfo, uploadInfo });
      case TABLE_RECEIPT:
        return this.saveReceiptPathAsync({ user, uploadInfo });
      default:
        break;
    }
  }

  //#region  SaveAssignmentPath
  static saveAssignmentPathAsync({ user, uploadInfo }) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql;
        const { destination, fileTable } = uploadInfo;
        sql = `
            INSERT INTO ${uploadInfo.fileTable.table} 
            SET Students_No = ?,
            Students_Name = ?,
            Teachers_Email = ?,
            Report_File = ?`;
        const { level, username, name } = user;

        const result = await db.query(sql, [
          level,
          username,
          username,
          destination,
        ]);

        const date = getCommonDateStyle();
        sql = `UPDATE ${TABLE_TEACHER} SET Dob = ? WHERE Username = ?`;
        await db.query(sql, [date, username]);
        const { affectedRows } = result;

        const info = {
          title: "Assignment from class teacher",
          body: `${name} has uploaded an assignment for ${level} class.`,
          data: {
            type: `assignment_${fileTable.format}`,
            level,
          },
        };

        if (affectedRows === 0) return resolve(false);
        const topic = FIREBASE_TOPIC.Parent;
        const payload = this.setNotificationPayload(info);
        resolve({ notify: true, payload, topic });
      } catch (err) {
        reject(err);
      }
    });
  }

  //#endregion

  //#region  SaveReportPath
  static saveReportPathAsync({ user, reportInfo, uploadInfo }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { destination, fileTable } = uploadInfo;
        const sql = `
            INSERT INTO ${fileTable.table} 
            SET Students_No = ?,
            Students_Name = ?,
            Teachers_Email = ?,
            Report_File = ?`;
        const { username, level } = user;
        const { studentName, studentNo } = reportInfo;

        const result = await db.query(sql, [
          studentNo,
          studentName,
          username,
          destination,
        ]);

        const { affectedRows } = result;
        if (affectedRows === 0) return resolve(false);

        const firstname = reportInfo.studentName.split(" ")[0];
        const info = {
          title: `${firstname} Terminal Report file`,
          body: `The end of term report file for ${studentName}`,
          data: {
            type: `report_${fileTable.format}`,
            level,
          },
        };

        const topic = FIREBASE_TOPIC.Parent;
        const payload = this.setNotificationPayload(info);
        resolve({ notify: true, payload, topic });
      } catch (err) {
        reject(err);
      }
    });
  }

  //#endregion

  //#region  SaveReceiptPath
  static saveReceiptPathAsync({ user, uploadInfo }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { destination, fileTable } = uploadInfo;
        const sql = ` 
              INSERT INTO ${fileTable.table}
              SET
                Ref_No = ?,
                Name = ?,
                Level = ?,
                Image = ?`;
        const { ref, name, level } = user;

        const result = await db.query(sql, [ref, name, level, destination]);
        const { affectedRows } = result;
        resolve(affectedRows > 0);
      } catch (err) {
        reject(err);
      }
    });
  }
  //#endregion

  static setNotificationPayload(info) {
    const { title, body, data } = info;
    return firebaseTopicPayload({ title, body, data });
  }

  //
  // ──────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: D E L E T E   F I L E   P A T H : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────────
  //
  static deleteFilePathAsync(id, { user, fileTable }) {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `DELETE FROM ${fileTable.table} WHERE id = ? AND Teachers_Email = ?`;
        const result = await db.query(sql, [id, user.username]);
        const { affectedRows } = result;
        resolve(affectedRows > 0);
      } catch (err) {
        reject(err);
      }
    });
  }

  //
  // ──────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: U P L O A D  V I D E O   F I L E   P A T H : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────────
  //
  static saveVideoFilePathAsync({ user, recipient, data }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { table } = data.info;
        const sql = `INSERT INTO ${table} (Recipient,Sender_ID,File) VALUES (?,?,?)`;
        const result = await db.query(sql, [recipient, user.ref, data.path]);
        const { affectedRows } = result;
        const notification = {
          title: `${user.name} has uploaded a video`,
          body: `Hey ${user.level} students, please check out this video`,
          data: {
            type: "video",
            level: user.level,
          },
        };
        if (affectedRows === 0) {
          return resolve(false);
        }
        //todo firebase notification here
        resolve({ notification });
      } catch (err) {
        reject(err);
      }
    });
  }

  static getSavedVideosPathAsync({ user }) {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
          SELECT v.id,
            v.Recipient AS recipient,
            v.Sender_ID AS refNo,
            t.Teachers_Name AS sender,
            v.File AS fileUrl,
            v.Created_At AS date
          FROM 
            ${TABLE_VIDEO} v
          INNER JOIN ${TABLE_TEACHER} t
          ON t.Teachers_No = v.Sender_ID 
          WHERE
            v.Recipient = ?
          ORDER BY id DESC
        `;
        const result = await db.query(sql, [user.level]);
        const data = await this.resolveDataDateAsync(result);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static resolveDataDateAsync(data) {
    return new Promise((resolve) => {
      data.forEach((d) => {
        d.date = dateFormat(d.date, DATE_TYPE.shortDate);
      });
      resolve(data);
    });
  }
}

module.exports = FileModel;
