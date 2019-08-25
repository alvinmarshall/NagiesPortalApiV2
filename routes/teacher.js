const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  ensureAuthentication,
  permissionMiddleWare
} = require("../utils/validation");
const { USER_ROLE } = require("../utils/constants");
const {
  parentComplaints,
  teacherAnnouncement,
  teacherUpload
} = require("../models/Teacher");
const {
  TABLE_ASSIGNMENT_PDF,
  TABLE_ASSIGNMENT_IMAGE
} = require("../utils/constants");

//#region parent complaints

//
// ─── TEACHER COMPAINTS MESSAGE ──────────────────────────────────────────────────
//

router.get("/complaints", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      parentComplaints(req, res, user.level);
    }
  })(req, res, next);
});

//#endregion

//#region teachers announcement
//
// ─── TEACHER ANNOUNCEMENT MESSAGES ──────────────────────────────────────────────
//

router.get("/announcement", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      teacherAnnouncement(req, res);
    }
  })(req, res, next);
});
//#endregion

//#region upload

//
// ─── UPLOAD STUDENT ASSIGNMENT PDF ──────────────────────────────────────────────────
//

router.post("/upload_assignment_pdf", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      teacherUpload(req, res, TABLE_ASSIGNMENT_PDF, user);
    }
  })(req, res, next);
});

router.post("/upload_assignment_image", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      teacherUpload(req, res, TABLE_ASSIGNMENT_IMAGE, user);
    }
  })(req, res, next);
});

//#endregion

module.exports = router;
