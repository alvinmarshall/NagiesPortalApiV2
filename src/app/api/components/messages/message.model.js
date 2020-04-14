/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 14:27:40
 * @modify date 2019-09-30 14:52:41
 * @desc [Message model]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const {
  TABLE_MESSAGE,
  TABLE_COMPLAINTS,
  TABLE_STUDENT,
} = require("../../common/constants");
const db = require("../../config/database");
const has = require("lodash").has;
class MessageModel {
  //
  // ─── GET TYPE MESSAGE ───────────────────────────────────────────────────────────
  //

  static getMessagesAsync({ user, from,paging }) {
    switch (from) {
      case "complaint":
        return this.getComplainAsync(user,paging);
      default:
        return this.getMessageAsync(user,paging);
    }
  }

  static getComplainAsync(user,paging) {
    const {start,end} = paging;
    const sql = `
    SELECT  
        id, 
        Students_No, 
        Students_Name,
        Level_Name,
        Guardian_Name,
        Guardian_No, 
        Teachers_Name,
        Message,
        Message_Date 
    FROM ${TABLE_COMPLAINTS}
    where Level_Name = ? ORDER BY Message_Date DESC LIMIT ?,? `;
    return db.query(sql, [user.level,start,end]);
  }

  static getMessageAsync(user,paging) {
    const {start,end} = paging;
    const sql = `
    SELECT 
        id, 
        Message_BY,
        M_Date, Message, 
        Message_Level, 
        M_Read
    FROM ${TABLE_MESSAGE} 
    WHERE Message_Level = ? OR Message_Level = ? 
    ORDER BY M_Date DESC LIMIT ?,?`;

    return db.query(sql, [user.level, user.ref,start,end]);
  }

  //
  // ─── SEND MESSAGE ───────────────────────────────────────────────────────────────
  //
  static saveSendMessageAsync({ recipient, user, messageData }) {
    let target_name = "";
    let level = user.level;

    if (has(messageData, "target_name")) {
      //check for selected student name
      target_name = messageData.target_name;
      if (has(messageData, "target_id")) {
        //checl for selected student reference number
        level =
          messageData.target_id === "" ? user.level : messageData.target_id;
      }
      console.log("Target name set", target_name);
      console.log("Target id set", level);
    }

    switch (recipient) {
      case "parent": // teacher sending this
        return this.insertTeacherMessageAsync({
          user,
          messageData,
          target_name,
        });

      case "teacher": // parent sending this
        return this.insertParentComplaintAsync({
          user,
          messageData,
          target_name,
        });

      default:
        throw new Error(`recipient type not found ${recipient}`);
    }
  }

  static insertTeacherMessageAsync({ user, messageData, target_name }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { username, level } = user;
        const { message } = messageData;
        const sql = `
            INSERT 
            INTO ${TABLE_MESSAGE} 
            SET 
              Message_BY = ?,
              Message = ?,
              Message_Level = ?`;

        const _ = await db.query(sql, [username, message, level]);

        const notificationPayload = {
          title: `${user.name} sent a message`,
          from: "teacher",
          type: "message",
          msg: message,
          target_name,
        };

        resolve(notificationPayload);
      } catch (err) {
        reject(err);
      }
    });
  }

  static insertParentComplaintAsync({ user, messageData, target_name }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { teacherName, message } = messageData;
        const { level, ref, name } = user;
        const guardian = await this.getGuardianInfoAsync(user);
        const { guardianContact, guardianName } = guardian[0];

        const sql = `
            INSERT 
            INTO ${TABLE_COMPLAINTS} 
            SET 
              Students_No = ?, 
              Students_Name = ?, 
              Message = ?,
              Level_Name = ?,
              Guardian_Name = ?,
              Guardian_No = ?,
              Teachers_Name = ?`;

        const _ = await db.query(sql, [
          ref,
          name,
          message,
          level,
          guardianName,
          guardianContact,
          teacherName,
        ]);

        const notificationPayload = {
          title: `${guardianName} sent you a complain`,
          from: "parent",
          type: "complaint",
          msg: message,
          target_name,
        };

        resolve(notificationPayload);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getGuardianInfoAsync(user) {
    const sql = `
        SELECT 
            Guardian_No AS guardianContact,
            Guardian_Name AS guardianName
        FROM ${TABLE_STUDENT} WHERE id = ?`;
    return db.query(sql, [user.id]);
  }

  //
  // ─── DELETE MESSAGE ─────────────────────────────────────────────────────────────
  //
  static deleteMessageAsync({ type, id }) {
    return new Promise(async (resolve, reject) => {
      try {
        const table = type === "complaints" ? TABLE_COMPLAINTS : TABLE_MESSAGE;
        const sql = `DELETE FROM ${table} WHERE id = ?`;
        const data = await db.query(sql, [id]);
        resolve(data.affectedRows > 0);
      } catch (err) {
        reject(err);
      }
    });
  }
  //
  // ─── GET USER SEMT MESSAGE ──────────────────────────────────────────────────────
  //

  static getSentMessageAsync({ user, from, paging }) {
    switch (from) {
      case "complaint":
        return this.getSentComplaintsAsync(user, paging);
      default:
        return this.getSentMessagesAsync(user, paging);
    }
  }

  static getSentMessagesAsync(user, paging) {
    const { start, end } = paging;
    const sql = `
      SELECT 
        id, 
        Message_BY, 
        M_Date, 
        Message, 
        Message_Level, 
        M_Read
      FROM ${TABLE_MESSAGE} 
      WHERE Message_BY = ? ORDER BY M_Date DESC LIMIT ?,?`;
    return db.query(sql, [user.username, start, end]);
  }

  static getSentComplaintsAsync(user, paging) {
    const { start, end } = paging;
    const sql = `
      SELECT  
        id, 
        Students_No, 
        Students_Name,
        Level_Name,
        Guardian_Name,
        Guardian_No, 
        Teachers_Name,
        Message,
        Message_Date 
      FROM ${TABLE_COMPLAINTS}
      where Students_No = ? ORDER BY Message_Date DESC LIMIT ?,?`;
    return db.query(sql, [user.ref, start, end]);
  }
}

module.exports = MessageModel;
