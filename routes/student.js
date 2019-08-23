const express = require("express");
const router = express.Router();
const { studentMessage } = require("../models/Student");
const passport = require("passport");
const { ensureAuthentication } = require("../utils/validation");

//#region message route
router.get("/messages", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (ensureAuthentication(err, res, info)) {
      studentMessage(req, res, user.level);
    }
  })(req, res, next);
});

//#endregion

module.exports = router;
