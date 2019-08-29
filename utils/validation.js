/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:56:48
 * @modify date 2019-08-23 18:56:48
 * @desc validators utility
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const { isEmpty, trim, isEqual } = require("lodash");
const { TABLE_REPORT_PDF, TABLE_REPORT_IMAGE } = require("../utils/constants");

module.exports = {
  //
  // ─── LOGIN INPUT VALIDATION ─────────────────────────────────────────────────────
  //

  loginInputValidation: req => {
    let errors = {};
    if (isEmpty(trim(req.body.username))) {
      errors.username = "username field empty";
    }

    if (isEmpty(trim(req.body.password))) {
      errors.password = "password field empty";
    }
    return errors;
  },

  //
  // ─── CHANGE PASSWORD VALIDATION ─────────────────────────────────────────────────
  //

  changePasswordValidation: req => {
    let errors = {};
    if (isEmpty(trim(req.body.old_password))) {
      errors.old_password = "provide current password";
    }
    if (isEmpty(trim(req.body.new_password))) {
      errors.new_password = "new password invalid";
    }
    if (isEmpty(trim(req.body.confirm_password))) {
      errors.confirm_password = "confirm password invalid";
    }
    if (!isEqual(req.body.new_password, req.body.confirm_password)) {
      errors.check = "new password set mismatch";
    }
    return errors;
  },

  //
  // ─── ENSURE ROUTE AUTHENTICATION ────────────────────────────────────────────────
  //

  ensureAuthentication: (err, res, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send({
        message: "authentication failed",
        error: info.message,
        status: 401
      });
      return false;
    }
    return true;
  },

  //
  // ─── USER PERMISSION ────────────────────────────────────────────────────────────
  //

  permissionMiddleWare: (res, allow, role) => {
    if (allow !== role) {
      res.status(403).send({
        message: "current permission doesn't allow this request",
        status: 403
      });
      return false;
    }
    return true;
  },

  //
  // ─── FILE VALIDATION ────────────────────────────────────────────────────────────
  //

  fileFieldValidation: (req, cb) => {
    let errors = {};

    if (isEmpty(req.files)) {
      errors.document = "Select a file to be uploaded";
    }
    if (!isEmpty(req.files)) {
      if (isEmpty(req.files.file)) {
        errors.file = "The upload form name must be set to file";
      }
    }

    if (!isEmpty(errors)) {
      return cb({
        message: "No files were uploaded",
        status: 400,
        errors: errors
      });
    }
    return cb(null);
  },

  //
  // ─── MESSAGE VALIDATION ─────────────────────────────────────────────────────────
  //

  messageInputValidation: (req, res) => {
    let errors = {};
    if (isEmpty(trim(req.body.message))) {
      errors.message = "message content can't be empty";
    }
    if (!isEmpty(errors)) {
      res
        .status(400)
        .send({ message: "Field empty", status: 400, errors: errors });
      return false;
    }
    return true;
  },

  //
  // ─── CHECK FOR REPORT UPLOAD ────────────────────────────────────────────────────
  //

  isUploadReport: (req, dbTable, cb) => {
    if (dbTable === TABLE_REPORT_PDF || dbTable === TABLE_REPORT_IMAGE) {
      let errors = {};
      if (isEmpty(trim(req.body.studentNo))) {
        errors.studentNo = "Student number required to upload report";
      }
      if (isEmpty(trim(req.body.studentName))) {
        errors.studentName = "Student name required to upload report";
      }
      if (!isEmpty(errors)) {
        return cb({ message: "Field empty", status: 400, errors: errors });
      }

      return cb(null, true);
    }
    return cb(null, false);
  },

  //
  // ─── GET TEACHER INFORMATION ────────────────────────────────────────────────────
  //

  complaintFieldValidation: (req, cb) => {
    let errors = {};
    if (isEmpty(trim(req.body.teacherName))) {
      errors.teacherName = "teacher name required for this action";
    }
    if (isEmpty(trim(req.body.message))) {
      errors.message = "message content can't be empty";
    }
    if (!isEmpty(errors)) {
      return cb({ message: "Field empty", status: 400, errors: errors });
    }

    return cb(null, {
      teacherName: req.body.teacherName,
      message: req.body.message
    });
  }
};
