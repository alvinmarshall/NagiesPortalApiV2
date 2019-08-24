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

const _ = require("lodash");

module.exports = {
  //
  // ─── LOGIN INPUT VALIDATION ─────────────────────────────────────────────────────
  //

  loginInputValidation: req => {
    let errors = {};
    if (_.isEmpty(_.trim(req.body.username))) {
      errors.username = "username field empty";
    }

    if (_.isEmpty(_.trim(req.body.password))) {
      errors.password = "password field empty";
    }
    return errors;
  },

  //
  // ─── CHANGE PASSWORD VALIDATION ─────────────────────────────────────────────────
  //

  changePasswordValidation: req => {
    let errors = {};
    if (_.isEmpty(_.trim(req.body.old_password))) {
      errors.old_password = "provide current password";
    }
    if (_.isEmpty(_.trim(req.body.new_password))) {
      errors.new_password = "new password invalid";
    }
    if (_.isEmpty(_.trim(req.body.confirm_password))) {
      errors.confirm_password = "confirm password invalid";
    }
    if (!_.isEqual(req.body.new_password, req.body.confirm_password)) {
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
  }
};
