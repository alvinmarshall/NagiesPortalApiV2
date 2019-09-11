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
}

module.exports = MessageController;
