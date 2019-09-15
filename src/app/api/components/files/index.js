/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:22:35
 * @modify date 2019-09-14 23:33:24
 * @desc [file route]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();
const Controller = require("./file.controller");
const { query, param } = require("express-validator");
const passport = require("passport");
const { isEmpty, trim } = require("lodash");

//#region GET FILE PATH
//
// ─── GET FILE PATH ──────────────────────────────────────────────────────────────
// @route GET api/v1/file/path
// @desc Files route
// @access Protected

router.get(
  "/path",
  passport.authenticate("jwt", { session: false }),
  [
    //
    // ───VALIDATE REQUEST PARAMS ─────────────────────────────────────────────
    //

    query("format")
      .not()
      .isEmpty()
      .trim()
      .custom(value => {
        if (!(value == "image" || value == "pdf")) {
          throw new Error("file format should be either an image or pdf ");
        }
        return value;
      }),

    query("type")
      .not()
      .isEmpty()
      .trim()
      .custom(value => {
        if (
          !(
            value == "assignment" ||
            value == "report" ||
            value == "bill" ||
            value == "circular" ||
            value == "timetable"
          )
        ) {
          throw new Error("provide a valid file type");
        }
        return value;
      })
  ],
  Controller.get
);

//#endregion

//#region  UPLOAD FILES

//
// ─── UPLOAD FILES ───────────────────────────────────────────────────────────────
// @route POST api/v1/file/path
// @desc Files upload route
// @access Protected
// @query param: type
// @options 'assignment','report','timetable'

router.post(
  "/uploads",
  passport.authenticate("jwt", { session: false }),
  [
    //
    // ───VALIDATE REQUEST PARAMS ─────────────────────────────────────────────
    //

    query("type", "provide a type")
      .not()
      .isEmpty()
      .trim()
      .custom((value, { req }) => {
        if (value == "report") {
          if (isEmpty(trim(req.body.studentNo))) {
            throw new Error("Student_No not provided for report");
          }
          if (isEmpty(trim(req.body.studentName))) {
            throw new Error("Student_Name not provided for report");
          }
        }
        return value;
      })
  ],
  Controller.upload
);
//#endregion

//#region DELETE FILES

//
// ─── DELETE FILES ───────────────────────────────────────────────────────────────
// @route DELETE api/v1/file/:id
// @desc delete file and path
// @access Protected
// @query param: type,format,path
// @path id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [
    //
    // ───VALIDATE REQUEST PARAMS ─────────────────────────────────────────────
    //

    param("id")
      .not()
      .isEmpty()
      .trim()
      .withMessage("provide an id"),
    query("type")
      .not()
      .isEmpty()
      .trim()
      .custom(value => {
        if (
          !(value == "assignment" || value == "report" || value == "timetable")
        ) {
          throw new Error("provide a valid file type");
        }
        return value;
      }),
    query("format")
      .not()
      .isEmpty()
      .trim()
      .custom(value => {
        if (!(value == "image" || value == "pdf")) {
          throw new Error("file format should be either an image or pdf ");
        }
        return value;
      }),
    query("path")
      .not()
      .isEmpty()
      .trim()
      .withMessage("missing file path")
  ],
  Controller.deleteFile
);
//#endregion

//#region DOWNLOAD FILE

//
// ─── DOWNLOAD FILE ──────────────────────────────────────────────────────────────
// @route GET api/v1/file/download
// @desc download file from asset
// @access Public
// @query param: path

router.get(
  "/download",
  [
    query("path")
      .not()
      .isEmpty()
      .trim()
      .withMessage("file path is missing")
  ],
  Controller.downloadWithPath
);
//#endregion

module.exports = router;
