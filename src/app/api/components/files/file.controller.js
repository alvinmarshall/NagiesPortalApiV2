/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:21:16
 * @modify date 2019-09-11 16:21:16
 * @desc [File Controller]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Service = require("./file.service");
const { validationResult } = require("express-validator");
class FileController {
  //
  // ─── GET SPECIFIED FILE PATH ────────────────────────────────────────────────────
  //

  static get(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "missing query params", status: 400, errors: errors });
    }
    let type = req.query.type,
      format = req.query.format;
    return Service.getType(
      req.user,
      { type: type, format: format },
      (err, files) => {
        if (err) return res.send(err);
        return res.send(files);
      }
    );
  }
  static upload(req, res) {}
}

module.exports = FileController;
