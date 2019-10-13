/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-12 23:04:17
 * @modify date 2019-09-12 23:43:51
 * @desc [teacher route]
 */

const express = require("express");
const router = express.Router();
const Controller = require("./teacher.controller");
const passport = require("passport");

//
// ─── GET CLASS STUDENTS ─────────────────────────────────────────────────────────
// @route GET api/v1/teacher/student
// @desc Find Class Students / array
// @access Protected

router.get(
  "/student",
  passport.authenticate("jwt", { session: false }),
  Controller.getClassStudent
);
module.exports = router;
