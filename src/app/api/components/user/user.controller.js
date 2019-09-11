/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 13:46:16
 * @desc UserController
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const { validationResult } = require("express-validator");
const User = require("./user.model");
const Service = require("../user/user.service");

//
// ─── USER AUTHENTICATION ────────────────────────────────────────────────────────
//

class UserController {
  //
  // ─── AUTHENTICATE USER ──────────────────────────────────────────────────────────
  //

  static authenticate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "field invalid", status: 400, errors: errors });
    }
    const role = req.query.role;
    return User.findOne(role, req.body, (err, user) => {
      if (err) {
        return res.status(err.status).send(err);
      }
      return Service.generateToken(role, user, (err, info) => {
        if (err) {
          return res
            .status(401)
            .send({ message: "authentication failed", status: 401 });
        }
        return res.status(200).send(info);
      });
    });
  }

  //
  // ─── CHANGE PASSWORD ────────────────────────────────────────────────────────────
  //

  static changePassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(errors);
    }
    let passObj = {
      _id: req.user.id,
      _old: req.body.old_password,
      _confirm: req.body.confirm_password
    };

    return Service.resetPassword(req.user.role, passObj, (err, msg) => {
      if (err) return res.status(err.status).send(err);
      return res.status(msg.status).send(msg);
    });
  }

  //
  // ─── ACCOUNT PROFILE ────────────────────────────────────────────────────────────
  //

  static accountProfile(req, res) {
    return Service.userProfile(req.user, (err, profile) => {
      if (err) return res.send(err);
      return res.send(profile);
    });
  }
}

module.exports = UserController;
