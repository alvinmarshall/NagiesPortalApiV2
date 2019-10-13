/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 12:52:26
 * @modify date 2019-09-11 13:45:49
 * @desc [user index route]
 */
//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();
const Controller = require("./user.controller");
const { body, check, query } = require("express-validator");
const passport = require("passport");

//
// ─── ACCOUNT LOGIN ──────────────────────────────────────────────────────────────
// @route POST api/v1/users
// @desc Login User / returning JWT Token
// @access Public
// @query params 'role'

router.post(
  "/",
  [
    //
    // ─── VALIDATE USER INPUT MIDDLEWARE ──────────────────────────────
    //

    body("username")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("provide a username"),
    body("password")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("provide a password"),
    query("role").custom(value => {
      if (!(value === "parent" || value === "teacher")) {
        throw new Error("invalid query params");
      }
      return value;
    })
  ],
  Controller.authenticate
);

//
// ─── CHANGE ACCOUNT PASSWORD ────────────────────────────────────────────────────
// @route POST api/v1/users/change_password
// @desc Change Account Password
// @access Protected

router.post(
  "/change_password",
  passport.authenticate("jwt", { session: false }),

  [
    //
    // ─── VALIDATE USER INPUT MIDDLEWARE ──────────────────────────────
    //

    body("old_password")
      .not()
      .isEmpty()
      .trim()
      .withMessage("provide current password"),

    body("new_password")
      .not()
      .isEmpty()
      .trim()
      .withMessage("provide new password"),

    body("confirm_password")
      .not()
      .isEmpty()
      .trim()
      .withMessage("provide confirm password"),

    check("new_password").isLength({ min: 4 }),

    check("confirm_password")
      .isLength({ min: 4 })
      .withMessage("provide atleast four characters for password"),

    check("confirm_password", "invalid password").custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("password mismatch");
      }
      return value;
    })
  ],
  Controller.changePassword
);

//
// ─── GET USER PROFILE ───────────────────────────────────────────────────────────
// @route POST api/v1/users/profile
// @desc User Profile Info
// @access Protected

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  Controller.accountProfile
);

module.exports = router;
