/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 13:00:18
 * @modify date 2019-09-11 14:19:34
 * @desc [Message route]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();
const Controller = require("./message.controller");
const passport = require("passport");

//
// ─── GET MESSAGE ────────────────────────────────────────────────────────────────
//

router.get(
  "/",passport.authenticate("jwt", { session: false }),Controller.getMessage
);
module.exports = router;
