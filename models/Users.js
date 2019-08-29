/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-08-23 18:40:18
 * @desc users model
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const Database = require("../config/Database");
const { dbConfig, jwtConfig } = require("../config/config");
const db = new Database(dbConfig);
const { isEmpty } = require("lodash");
const jsonWebToken = require("jsonwebtoken");
const { stringToBoolean } = require("../utils/stringToBoolean");
const {
  TABLE_TEACHER,
  TABLE_STUDENT,
  USER_ROLE
} = require("../utils/constants");
const {
  profileFormat,
  noDataFormat,
  authenticationFailedFormat,
  loginPayloadFormat,
  showData
} = require("../utils/formatResource");

module.exports = {
  //
  // ─── AUTHENTICATION WITH ID ─────────────────────────────────────────────────────
  //

  //#region authenticate with id
  authenticateWithId: (role, id) => {
    let sql = "";
    switch (role) {
      case USER_ROLE.Parent:
        sql = `SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image FROM ${TABLE_STUDENT} WHERE id = ? LIMIT 1`;
        return db.query(sql, [id]);
      case USER_ROLE.Teacher:
        sql = `SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image FROM ${TABLE_TEACHER} WHERE id = ? LIMIT 1`;
        return db.query(sql, [id]);
      default:
        break;
    }
  },
  //#endregion

  //
  // ─── AUTHENTICATION WITH USERNAME AND PASSWORD ──────────────────────────────────
  //

  //#region authenticate with username
  authenticateUserWithUsername: (req, res, role) => {
    let sql = "";
    switch (role) {
      case USER_ROLE.Parent:
        sql = `SELECT id,Students_No,Level_Name,Students_Name,Index_No,Image FROM ${TABLE_STUDENT} WHERE Index_No = ? AND Password = ? LIMIT 1 `;
        prepareToAuthenticate(req, res, sql, USER_ROLE.Parent);
        break;

      case USER_ROLE.Teacher:
        sql = `SELECT id,Teachers_No ,Level_Name,Teachers_Name ,Username, Image FROM ${TABLE_TEACHER} WHERE Username = ? AND Password = ? LIMIT 1 `;
        prepareToAuthenticate(req, res, sql, USER_ROLE.Teacher);
        break;

      default:
        break;
    }
  },
  //#endregion

  //
  // ─── CHANGE ACCOUNT PASSWORD ────────────────────────────────────────────────────
  //

  //#region change Password
  changeAccountPassword: (req, res, user) => {
    const passObj = {
      id: user.id,
      old: req.body.old_password,
      new: req.body.new_password,
      confirm: req.body.confirm_password
    };
    switch (user.role) {
      case USER_ROLE.Parent:
        changePassword(passObj, res, TABLE_STUDENT);
        break;
      case USER_ROLE.Teacher:
        changePassword(passObj, res, TABLE_TEACHER);
        break;
      default:
        break;
    }
  },
  //#endregion

  //
  // ─── PROFILE ACCOUNT ────────────────────────────────────────────────────────────
  //

  //#region Account Profile
  profileAccount: (res, role, id) => {
    let sql = "";
    switch (role) {
      case USER_ROLE.Parent:
        sql = `SELECT * FROM ${TABLE_STUDENT} WHERE id = ?`;
        accountProfile(res, sql, id, USER_ROLE.Parent);
        break;

      case USER_ROLE.Teacher:
        sql = `SELECT id, Teachers_No, Teachers_Name, Dob, Gender, Contact, Admin_Date, Faculty_Name, Level_Name, Username, Image FROM ${TABLE_TEACHER} WHERE id = ?`;
        accountProfile(res, sql, id, USER_ROLE.Teacher);
        break;

      default:
        break;
    }
  }
  //#endregion
};

//
// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
//

//#region Functions

//#region function account for profile
const accountProfile = (res, sql, id, role) => {
  db.query(sql, id)
    .then(data => {
      return data[0];
    })
    .then(data => {
      if (isEmpty(data)) {
        res.status(404).send(noDataFormat());
        return;
      }
      const _data = profileFormat(role, data);
      const type =
        role === USER_ROLE.Parent ? "studentProfile" : "teacherProfile";
      res.send(showData(_data, type));
    })
    .catch(err => console.error(err));
};
//#endregion

//#region function for account password
const changePassword = (passObj, res, table) => {
  const sql = `SELECT IF ( COUNT(*) > 0,'true','false') AS exist  FROM ${table} WHERE id = ? AND Password = ?`;
  db.query(sql, [passObj.id, passObj.old])
    .then(data => {
      return stringToBoolean(data[0].exist);
    })
    .then(isValid => {
      if (!isValid) {
        res
          .status(404)
          .send({ message: "username or password invalid", status: 404 });
        return;
      }
      db.query(`UPDATE ${table} SET Password = ? WHERE id = ?`, [
        passObj.new,
        passObj.id
      ])
        .then(row => {
          if (!row) {
            res.status(400).send({
              message: "updating password failed...",
              status: 400
            });
            return;
          }
          res.send({
            message: "updated password successful",
            status: 200
          });
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};
//#endregion

//#region function for authentication
prepareToAuthenticate = (req, res, sql, role) => {
  db.query(sql, [req.body.username, req.body.password])
    .then(data => {
      return data[0];
    })
    .then(data => {
      if (isEmpty(data)) {
        res.status(401).send(authenticationFailedFormat());
        return;
      }
      const payload = loginPayloadFormat(role, data);
      jsonWebToken.sign(payload, jwtConfig.secret, (err, encode) => {
        if (err) {
          console.error(err);
          res.status(401).send(err);
          return;
        }
        res.json({
          message: "Login Successful",
          uuid: payload.id,
          token: `Bearer ${encode}`,
          imageUrl: payload.imageUrl,
          role: payload.role,
          status: 200
        });
      });
    })
    .catch(err => console.error(err));
};
//#endregion

//#endregion
