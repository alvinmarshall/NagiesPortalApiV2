/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 14:10:21
 * @modify date 2019-09-11 14:10:21
 * @desc [Message Controller]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Service = require("./message.service");
const { MESSAGE_TYPE } = require("../../common/constants");
const { validationResult } = require("express-validator");
class MessageController {
  //
  // ─── GET SPECIFIC MESSAGE TYPE ──────────────────────────────────────────────────
  //

  static getMessage(req, res) {
    let type = req.query.from == "admin" ? "administrator" : req.user.level;
    return Service.message(type, (err, msg) => {
      if (err) return res.send(err);
      return res.send(msg);
    });
  }

  //
  // ─── SEND SPECIFIED MESSAGE ─────────────────────────────────────────────────────
  //

  static sendMessage(req, res) {
    let user = req.user,
      error = [],
      to = req.query.to,
      messagebody = req.body,
      type =
        user.role == "parent" ? MESSAGE_TYPE.Complaint : MESSAGE_TYPE.Message;
    if (user.role == "parent") {
      if (!messagebody.teacherName) {
        error.push({ teacherName: "teacher name not set" });
      }
      if (to == "parent") {
        error.push({ to: "sorry, you can't send message to yourself" });
      }
    }

    if (user.role == "teacher") {
      if (to == "teacher") {
        error.push({ to: "sorry, you can't send message to yourself" });
      }
    }
    const valderr = validationResult(req); // express validator error
    if (!valderr.isEmpty()) {
      return res
        .status(400)
        .send({ message: "field invalid", status: 400, errors: valderr });
    }
    if (error.length > 0)
      return res
        .status(400)
        .send({ message: "field invalid", status: 400, error: error });

    return Service.send(
      { to: to, type: type, user: user, message: messagebody },
      (err, result) => {
        if (err)
          return res
            .status(400)
            .send({ message: "an error occurred", status: 500, errors: err });
        return res.send(result);
      }
    );
  }
}

module.exports = MessageController;
