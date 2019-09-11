/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:22:35
 * @modify date 2019-09-11 20:13:16
 * @desc [file route]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();
const Controller = require("./file.controller");
const { query, check } = require("express-validator");
const passport = require("passport");
//
// ─── GET FILE PATH ──────────────────────────────────────────────────────────────
//

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
            value == "circular"
          )
        ) {
          throw new Error("provide a valid file type");
        }
        return value;
      })
  ],
  Controller.get
);
router.post("/upload", Controller.upload);
module.exports = router;
