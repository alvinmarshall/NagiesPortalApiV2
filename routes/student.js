const express = require("express");
const router = express.Router();
const { studentMessage, studentAssignment } = require("../models/Student");
const passport = require("passport");
const { ensureAuthentication } = require("../utils/validation");
const { ASSIGNMENT_TYPE } = require("../utils/constants");

//#region message route
router.get("/messages", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (ensureAuthentication(err, res, info)) {
      studentMessage(req, res, user.level);
    }
  })(req, res, next);
});

//#endregion

//#region assignment pdf
router.get("/assignment_pdf", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (ensureAuthentication(err, res, info)) {
      studentAssignment(req, res, ASSIGNMENT_TYPE.PDF, user.level);
    }
  })(req, res, next);
});
//#endregion

//#region assignment image
router.get("/assignment_image", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (ensureAuthentication(err, res, info)) {
      studentAssignment(req, res, ASSIGNMENT_TYPE.IMAGE, user.level);
    }
  })(req, res, next);
});
//#endregion

module.exports = router;
