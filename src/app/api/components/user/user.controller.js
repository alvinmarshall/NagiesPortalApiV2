/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 13:46:16
 * @desc UserController
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const { validationResult } = require("express-validator");
const User = require("./user.model");
const Service = require("../user/user.service");

//
// ─── USER AUTHENTICATION ────────────────────────────────────────────────────────
//

class UserController {
  //
  // ─── AUTHENTICATE USER ──────────────────────────────────────────────────────────
  //

  static async authenticate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .send({ message: "field invalid", status: 400, errors: errors });

      const role = req.query.role;
      const credentials = {
        username: req.body.username || "",
        password: req.body.password || "",
      };

      const user = await User.findAuthUserAsync(role, credentials);

      const { token, payload } = await Service.generateTokenAsync(role, user);
      const data = {
        message: "Login Successful",
        uuid: payload.id,
        token,
        imageUrl: payload.imageUrl,
        role: payload.role,
        level: payload.level,
        name: payload.name,
        status: 200,
      };
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res
        .status(401)
        .send({ message: "authentication failed", status: 401 });
    }
  }

  //
  // ─── CHANGE PASSWORD ────────────────────────────────────────────────────────────
  //

  static async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ status: 400, errors });
      }

      const passObj = {
        id: req.user.id,
        oldPassword: req.body.old_password,
        newPassword: req.body.confirm_password,
      };

      const user = req.user;
      const data = await Service.resetPasswordAsync(user, passObj);
      const status = data === true ? "successful" : "a failed";

      return res.send({
        message: `Update password was ${status} `,
        status: 200,
      });
    } catch (err) {
      console.log("err",err);
      if (err.message === "Unknown user")
        return res
          .status(400)
          .send({ message: "User not found, check credentials", status: 400 });
      return res.status(500).send({ message: "Internal error", status: 500 });
    }
  }

  //
  // ─── ACCOUNT PROFILE ────────────────────────────────────────────────────────────
  //

  static async accountProfile(req, res) {
    try {
      const user = req.user;
      const data = await Service.userProfileAsync(user);
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal error" });
    }
  }
}

module.exports = UserController;
