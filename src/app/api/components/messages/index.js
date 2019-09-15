/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 13:00:18
 * @modify date 2019-09-30 14:52:50
 * @desc [Message route]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();
const Controller = require("./message.controller");
const passport = require("passport");
const { body, query, param, } = require("express-validator");

//
// ─── GET MESSAGE ────────────────────────────────────────────────────────────────
// @route GET api/v1/message
// @desc Message route
// @access Protected
// @query params 'from'
// @options 'announcement','complain'

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  Controller.getMessage
);

//
// ─── SEND MESSAGE ───────────────────────────────────────────────────────────────
// @route POST api/v1/message
// @desc Message route
// @access Protected
// @query params 'to'
// @options 'parent' as a message, 'teacher' as complaint

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  [
    query("to")
      .not()
      .isEmpty()
      .trim()
      .custom(value => {
        if (!(value == "parent" || value == "teacher")) {
          throw new Error("invalid query, must be either parent or teacher");
        }
        return value;
      }),
    body("message")
      .not()
      .isEmpty()
      .trim()
      .withMessage("message must be aleat 4 characters")
  ],
  Controller.sendMessage
);

//
// ─── DELETE MESSAGE BY ID ───────────────────────────────────────────────────────
// @route DELETE api/v1/message/:type/:id
// @desc Delete message route
// @access Protected
// @path params 'type','id'
// @options complaint

router.delete(
  "/:id/:type",
  Controller.deleteMessageById
);

module.exports = router;
