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
const isEmpty = require("lodash").isEmpty;
const logger = require("../../config/logger.service");
class FileController {
  //
  // ─── GET SPECIFIED FILE PATH ────────────────────────────────────────────────────
  //

  static get(req, res) {
    const errors = validationResult(req);
    logger.log("info", "file.controller.get.req", {
      method: req.method,
      query: req.query,
      params: req.params,
      body: req.body
    });
    if (!errors.isEmpty()) {
      logger.log("error", "file.controller.get", { res:{validationError: errors} });
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
        if (err) {
          logger.log("error", "Service.getType", {res:err});
          return res.send(err);
        }
        logger.log("info", "file.controller.get", { res: files });
        return res.send(files);
      }
    );
  }

  //
  // ─── UPLOAD FILE ────────────────────────────────────────────────────────────────
  //

  static upload(req, res) {
    const errors = validationResult(req);
    logger.log("info", "file.controller.upload.req", {
      method: req.method,
      query: req.query,
      params: req.params,
      body: req.body
    });
    if (!errors.isEmpty()) {
      logger.log("error", "file.controller.upload", {
        res: { status: 400, validationError: errors }
      });
      return res.status(400).send(errors);
    }

    // if (req.user.role != "teacher") {
    //   logger.log("error", "file.controller.upload", {
    //     res: { message: "You don't have access to this route", status: 403 }
    //   });
    //   return res
    //     .status(403)
    //     .send({ message: "You don't have access to this route", status: 403 });
    // }

    if (isEmpty(req.files)) {
      logger.log("error", "file.controller.upload", {
        res: { message: "No file selected", status: 400 }
      });
      return res.status(400).send({ message: "No file selected", status: 400 });
    }
    let type = req.query.type,
      file = req.files.file,
      reportInfo;

    if (type === "report") {
      reportInfo = {
        studentNo: req.body.studentNo,
        studentName: req.body.studentName
      };
    }

    if (!file) {
      {
        logger.log("error", "file.controller.upload", {
          res: {
            message:
              "ensure that form name set to 'file' and choose a file to upload",
            status: 400
          }
        });
        return res.status(400).send({
          message:
            "ensure that form name set to 'file' and choose a file to upload",
          status: 400
        });
      }
    }

    return Service.uploadType(
      req.user,
      { type, file, reportInfo },
      (err, result) => {
        if (err) {
          logger.log("error", "Service.uploadType", {
            res: err
          });
          return res.send(err);
        }

        if (result.affectedRows === 0) {
          logger.log("error", "Service.uploadType", {
            res: { message: "upload file failed", status: 304 }
          });
          return res.send({ message: "upload file failed", status: 304 });
        }

        logger.log("info", "Service.uploadType", {
          res: { message: "file path uploaded successful", status: 200 }
        });
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
    logger.log("info", "file.controller.deleteFile.req", {
      method: req.method,
      query: req.query,
      params: req.params,
      body: req.body
    });
    if (!errors.isEmpty()) {
      {
        logger.log("error", "file.controller.deleteFile", {
          status: 400,
          validationError: errors
        });
        return res.status(400).send({
          message: "missing query params",
          status: 400,
          errors: errors
        });
      }
    }

    if (req.user.role != "teacher") {
      logger.log("error", "file.controller.deleteFile", {
        accessError: "You don't have access to this route",
        status: 403
      });
      return res
        .send(403)
        .send({ message: "You don't have access to this route", status: 403 });
    }

    let id = req.params.id,
      { path, format, type } = req.query;

    Service.deleteType(req.user, { id, path, type, format }, (err, result) => {
      if (err) {
        logger.log("error", "file.controller.deleteFile", {
          status: 500,
          error: err
        });
        return res.send(err);
      }
      logger.log("error", "file.controller.deleteFile", {
        res: result,
        status: 200
      });
      return res.send(result);
    });
  }

  //
  // ─── DOWNLOAD FILE ──────────────────────────────────────────────────────────────
  //

  static downloadWithPath(req, res) {
    const errors = validationResult(req);
    logger.log("info", "file.controller.downloadWithPath.req", {
      method: req.method,
      query: req.query,
      params: req.params,
      body: req.body
    });
    if (!errors.isEmpty()) {
      logger.log("error", "file.controller.downloadWithPath", {
        status: 400,
        validationError: errors
      });
      return res.status(400).send(errors);
    }
    let fileUrl = req.query.path;
    let filePath = `public/${fileUrl}`;
    let filename = path.basename(filePath);
    res.download(filePath, filename, err => {
      if (err) {
        logger.log("error", "file.controller.downloadWithPath", {
          status: 500,
          file: "No file found",
          error: err
        });
        res.status(500).send({ message: "No file found", status: 500 });
        return;
      }
    });
  }
}

module.exports = FileController;
