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
const { VIDEO_FILE } = require("../../common/constants");
const logger = require("../../config/logger.service");
class FileController {
  //
  // ─── GET SPECIFIED FILE PATH ────────────────────────────────────────────────────
  //

  static async get(req, res) {
    try {
      const errors = validationResult(req);
      logger.log("info", "file.controller.get.req", {
        method: req.method,
        query: req.query,
        params: req.params,
        body: req.body,
      });
      if (!errors.isEmpty()) {
        logger.log("error", "file.controller.get", {
          res: { validationError: errors },
        });
        return res.status(400).send({
          message: "missing query params",
          status: 400,
          errors: errors,
        });
      }

      const { type, format } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const paging = {
        start: (page - 1) * limit,
        end: limit,
      };

      const data = await Service.getFileTypeAsync(req.user, {
        type: type,
        format: format,
        paging,
      });

      return res.send(data);
    } catch (err) {
      logger.log("error", "Service.getType", { res: err });
      return res.send(err);
    }
  }

  //
  // ─── UPLOAD FILE ────────────────────────────────────────────────────────────────
  //

  static async upload(req, res) {
    try {
      const errors = validationResult(req);
      logger.log("info", "file.controller.upload.req", {
        method: req.method,
        query: req.query,
        params: req.params,
        body: req.body,
      });
      if (!errors.isEmpty()) {
        logger.log("error", "file.controller.upload", {
          res: { status: 400, validationError: errors },
        });
        return res.status(400).send(errors);
      }

      if (isEmpty(req.files)) {
        logger.log("error", "file.controller.upload", {
          res: { message: "No file selected", status: 400 },
        });
        return res
          .status(400)
          .send({ message: "No file selected", status: 400 });
      }
      let type = req.query.type,
        file = req.files.file,
        reportInfo;

      if (type === "report") {
        reportInfo = {
          studentNo: req.body.studentNo,
          studentName: req.body.studentName,
        };
      }

      if (!file) {
        {
          logger.log("error", "file.controller.upload", {
            res: {
              message:
                "ensure that form name set to 'file' and choose a file to upload",
              status: 400,
            },
          });
          return res.status(400).send({
            message:
              "ensure that form name set to 'file' and choose a file to upload",
            status: 400,
          });
        }
      }

      const result = await Service.uploadFileTypeAsync(req.user, {
        type,
        file,
        reportInfo,
      });

      if (!result)
        return res.status(400).send({
          message: "upload failed",
          status: 400,
        });

      return res.send({
        message: "file path uploaded successful",
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Internal error occurred", status: 500 });
    }
  }

  //
  // ─── DELETE FILE ────────────────────────────────────────────────────────────────
  //

  static async deleteFile(req, res) {
    try {
      const errors = validationResult(req);
      logger.log("info", "file.controller.deleteFile.req", {
        method: req.method,
        query: req.query,
        params: req.params,
        body: req.body,
      });
      if (!errors.isEmpty()) {
        {
          logger.log("error", "file.controller.deleteFile", {
            status: 400,
            validationError: errors,
          });
          return res.status(400).send({
            message: "missing query params",
            status: 400,
            errors: errors,
          });
        }
      }

      if (req.user.role != "teacher") {
        logger.log("error", "file.controller.deleteFile", {
          accessError: "You don't have access to this route",
          status: 403,
        });
        return res.send(403).send({
          message: "You don't have access to this route",
          status: 403,
        });
      }

      let id = req.params.id,
        { path, format, type } = req.query;

      const data = await Service.deleteTypeAsync(req.user, {
        id,
        path,
        type,
        format,
      });
      if (!data) return res.send({ message: "File not found", status: 200 });

      return res.send({ message: "File deleted successful", status: 200 });
    } catch (err) {
      logger.log("error", "file.controller.deleteFile", {
        status: 500,
        error: err,
      });

      return res
        .status(500)
        .send({ message: "Internal error occurred", status: 500 });
    }
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
      body: req.body,
    });
    if (!errors.isEmpty()) {
      logger.log("error", "file.controller.downloadWithPath", {
        status: 400,
        validationError: errors,
      });
      return res.status(400).send(errors);
    }
    let fileUrl = req.query.path;
    let filePath = `public/${fileUrl}`;
    let filename = path.basename(filePath);
    res.download(filePath, filename, (err) => {
      if (err) {
        logger.log("error", "file.controller.downloadWithPath", {
          status: 500,
          file: "No file found",
          error: err,
        });
        res.status(500).send({ message: "No file found", status: 500 });
        return;
      }
    });
  }

  static async uploadVideo(req, res) {
    try {
      if (!req.hasOwnProperty("files"))
        return res
          .status(400)
          .send({ status: 400, message: "No file selected" });

      const uploadData = req.files;

      if (!uploadData.hasOwnProperty("file"))
        return res
          .status(400)
          .send({ status: 400, message: "form field should be name=file" });

      const recipient = req.user.level;
      const { file } = uploadData;
      const user = req.user;
      const info = VIDEO_FILE.info;
      const data = await Service.uploadVideoAsync({
        user,
        recipient,
        file,
        info,
      });
      return res.send({ status: 200, data });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ status: 500, message: "Internal error occurred" });
    }
  }

  static async getVideos(req, res) {
    try {
      const user = req.user;
      const data = await Service.getVideosAsync({ user });
      return res.send({ status: 200, data });
    } catch (error) {
      console.error(err);
      return res
        .status(500)
        .send({ status: 500, message: "Internal error occurred" });
    }
  }

  static async deleteVideoById(req, res) {
    try {
      const user = req.user;
      const id = parseInt(req.query.id);
      if (!id)
        return res
          .status(400)
          .send({ message: "missing id query", status: 400 });

      const data = await Service.deleteVideoByIdAsync({ id, user });
      const status = data === true ? "successful" : "a failure";
      return res.send({
        message: `file delete action was ${status} `,
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Internal error occurred", status: 500 });
    }
  }

  static async getUploadedVideos(req, res) {
    try {
      const user = req.user;
      const data = await Service.getUploadedVideosAsync(user);
      return res.send({ data, status: 200 });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: `Internal error occurred`, status: 500 });
    }
  }
}

module.exports = FileController;
