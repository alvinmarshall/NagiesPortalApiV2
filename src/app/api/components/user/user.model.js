/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 13:34:41
 * @desc users model
 */
//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const db = require("../../config/database");
const {
  USER_ROLE,
  TABLE_STUDENT,
  TABLE_TEACHER,
} = require("../../common/constants");
const { stringToBoolean } = require("../../common/utils/stringToBoolean");

class UserModel {
  //
  // ─── GET USER INFO USING EMAIL AND PASSWORD ─────────────────────────────────────
  //

  findAuthUserAsync(role, credentials) {
    let sql;
    const { username, password } = credentials;
    if (role === USER_ROLE.Parent) {
      sql = `SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image,Faculty_Name FROM ${TABLE_STUDENT} WHERE Index_No = ? AND Password = ? LIMIT 1 `;
    }
    if (role === USER_ROLE.Teacher) {
      sql = `SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image,Faculty_Name FROM ${TABLE_TEACHER} WHERE Username = ? AND Password = ? LIMIT 1 `;
    }
    return db.query(sql, [username, password]).then((data) => data[0]);
  }

  //
  // ─── GET USER INFORMATION USING ID ──────────────────────────────────────────────
  //

  findUserAsync(payload) {
    let sql;

    if (payload.role === USER_ROLE.Parent) {
      sql = `SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image,Faculty_Name FROM ${TABLE_STUDENT} WHERE id = ? LIMIT 1`;
    }
    if (payload.role === USER_ROLE.Teacher) {
      sql = `SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image,Faculty_Name FROM ${TABLE_TEACHER} WHERE id = ? LIMIT 1`;
    }

    return db.query(sql, [payload.id]).then((data) => data[0]);
  }

  //
  // ─── GET USER PROFILE ──────────────────────────────────────────────
  //
  getProfileAsync(user) {
    if (user.role === USER_ROLE.Parent) return this.parentProfileAsync(user.id);
    if (user.role === USER_ROLE.Teacher)
      return this.teacherProfileAsync(user.id);
  }

  teacherProfileAsync(id) {
    const sql = `
        SELECT 
            id, 
            Teachers_No, 
            Teachers_Name, 
            Dob, 
            Gender, 
            Contact, 
            Admin_Date, 
            Faculty_Name, 
            Level_Name, 
            Username, 
            Image 
        FROM ${TABLE_TEACHER} 
        WHERE id = ?
        LIMIT 1`;

    return db.query(sql, [id]).then((data) => data[0]);
  }

  parentProfileAsync(id) {
    const sql = `
        SELECT 
            id, 
            Students_No, 
            Students_Name, 
            Dob, 
            Gender,
            Section_Name,
            Faculty_Name,
            Level_Name,
            Semester_Name,
            Index_No,
            Guardian_No,
            Guardian_Name,
            Admin_Date,
            Image

        FROM ${TABLE_STUDENT} 
        WHERE id = ?
        LIMIT 1`;
    return db.query(sql, [id]).then((data) => data[0]);
  }

  //
  // ─── CHANGE ACCOUNT PASSWORD ────────────────────────────────────────────────────
  //

  changeUserPasswordAsync(role, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, oldPassword, newPassword } = payload;
        const table = role === USER_ROLE.Parent ? TABLE_STUDENT : TABLE_TEACHER;
        const isValid = await this.validateOldPasswordAsync(id, oldPassword, table);
        if (!isValid) return reject(new Error("Unknown user"));
        const isUpdated = await this.updateUserPasswordAsync(id, newPassword,table);
        resolve(isUpdated);
      } catch (err) {
        resolve(err);
      }
    });
  }

  validateOldPasswordAsync(id, oldPassword, table) {
    const sql = `
      SELECT 
      IF ( COUNT(*) > 0,'true','false') AS exist
      FROM ${table} 
      WHERE id = ? 
      AND Password = ? LIMIT 1`;
    return db
      .query(sql, [id, oldPassword])
      .then((data) => stringToBoolean(data[0].exist));
  }

  updateUserPasswordAsync(id, newPassword,table) {
    const sql = `
        UPDATE ${table} 
        SET 
        Password = ? 
        WHERE id = ?`;
    return db
      .query(sql, [newPassword, id])
      .then((data) => data.affectedRows > 0);
  }
}
module.exports = new UserModel();
