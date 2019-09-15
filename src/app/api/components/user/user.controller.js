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
const { firebaseTopicPayload } = require("../../common/utils/data.format");
const Firebase = require("../notification/firebase.service");

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
      return res.status(400).send({status:400,errors});
    }
    let passObj = {
      _id: req.user.id,
      _old: req.body.old_password,
      _confirm: req.body.confirm_password
    };
    let user = req.user;
    return Service.resetPassword({user, passObj}, (err, msg) => {
      if (err) return res.status(400).send(err);
      let topic = user.role === "teacher" ? "teachers" : user.role;
      let title = msg.title;
      let body = msg.body;
      let data = {};
      data.type = "password";
      data.name = user.name
      const payload = firebaseTopicPayload({ title, body, data });
      Firebase.sendTopicMessage({ topic, payload }, (err, res) => {
        if (err) return console.error(err);
        return console.log(res);
      });
      return res.send(msg.msg);
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
