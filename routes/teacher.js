const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  ensureAuthentication,
  permissionMiddleWare,
  messageInputValidation
} = require("../utils/validation");
const { USER_ROLE } = require("../utils/constants");
const {
  parentComplaints,
  teacherAnnouncement,
  teacherUpload,
  sendMessageToParent,
  classStudents
} = require("../models/Teacher");
const {
  TABLE_ASSIGNMENT_PDF,
  TABLE_ASSIGNMENT_IMAGE,
  TABLE_REPORT_PDF,
  TABLE_REPORT_IMAGE
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

//
// ───UPLOAD STUDENT REPORTS PDF ────────────────────────────────────────────────────────────────────
//

router.post("/upload_report_pdf", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      teacherUpload(req, res, TABLE_REPORT_PDF, user);
    }
  })(req, res, next);
});

//
// ───UPLOAD STUDENT REPORTS IMAGE ────────────────────────────────────────────────────────────────────
//

router.post("/upload_report_image", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      teacherUpload(req, res, TABLE_REPORT_IMAGE, user);
    }
  })(req, res, next);
});
//#endregion

//#region send message to parent

//
// ─── SEND MESSAGE TO PARENT ─────────────────────────────────────────────────────
//

router.post("/send_message", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      if (messageInputValidation(req, res)) {
        sendMessageToParent(req, res, user);
      }
    }
  })(req, res, next);
});
//#endregion

//#region class students
//
// ─── CLASS STUDENTS ──────────────────────────────────────────────────────────────
//

router.get("/class_student", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      ensureAuthentication(err, res, info) &&
      permissionMiddleWare(res, USER_ROLE.Teacher, user.role)
    ) {
      classStudents(req, res, user.level);
    }
  })(req, res, next);
});

//#endregion

module.exports = router;
