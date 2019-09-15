/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:21:16
 * @modify date 2019-09-14 23:35:29
 * @desc [File Controller]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Service = require("./file.service");
const { validationResult } = require("express-validator");
const path = require("path");
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

  //
  // ─── UPLOAD FILE ────────────────────────────────────────────────────────────────
  //

  static upload(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send(errors);

    if (req.user.role != "teacher")
      return res
        .status(403)
        .send({ message: "You don't have access to this route", status: 403 });

    let type = req.query.type,
      file = req.files.file,
      reportInfo;

    if (type == "report") {
      reportInfo = {
        studentNo: req.body.studentNo,
        studentName: req.body.studentName
      };
    }

    if (!file) {
      return res.status(400).send({
        message:
          "ensure that form name set to 'file' and choose a file to upload",
        status: 400
      });
    }

    return Service.uploadType(
      req.user,
      { type, file, reportInfo },
      (err, result) => {
        if (err) return res.send(err);

        if (result.affectedRows == 0)
          return res.send({ message: "upload file failed", status: 304 });

        return res.send({
          message: "file path uploaded successful",
          status: 200
        });
      }
    );
  }

  //
  // ─── DELETE FILE ────────────────────────────────────────────────────────────────
  //

  static deleteFile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ message: "missing query params", status: 400, errors: errors });
    }

    if (user.role != "teacher")
      return res
        .send(403)
        .send({ message: "You don't have access to this route", status: 403 });

    let id = req.params.id,
      { path, format, type } = req.query;

    Service.deleteType(req.user, { id, path, type, format }, (err, result) => {
      if (err) return res.send(err);
      return res.send(result);
    });
  }

  //
  // ─── DOWNLOAD FILE ──────────────────────────────────────────────────────────────
  //

  static downloadWithPath(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors);
    let fileUrl = req.query.path;
    let filePath = `public/${fileUrl}`;
    let filename = path.basename(filePath);
    res.download(filePath, filename, err => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "No file found", status: 500 });
        return;
      }
    });
  }
}

module.exports = FileController;
