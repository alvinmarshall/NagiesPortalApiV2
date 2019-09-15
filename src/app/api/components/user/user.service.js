const jsonWebToken = require("jsonwebtoken");
const config = require("config");
const {
  loginPayloadFormat,
  profileFormat,
  showData
} = require("../../common/utils/data.format");
const User = require("./user.model");
const dateFormat = require("dateformat");
const { DATE_TYPE } = require("../../common/constants");
class UserService {
  //
  // ─── GENERATE JWT TOKEN FOR LOGIN USER ──────────────────────────────────────────
  //

  generateToken(role, data, cb) {
    let payload = loginPayloadFormat(role, data);
    jsonWebToken.sign(
      payload,
      config.get("jwtConfig.secret"),
      (err, encode) => {
        if (err) {
          return cb(err);
        }
        const userInfo = {
          message: "Login Successful",
          uuid: payload.id,
          token: `Bearer ${encode}`,
          imageUrl: payload.imageUrl,
          role: payload.role,
          level: payload.level,
          name: payload.name,
          status: 200
        };
        return cb(null, userInfo);
      }
    );
  }

  //
  // ─── CHANGE USER PASSWORD ───────────────────────────────────────────────────────
  //

  resetPassword({ user, passObj }, cb = (err, msg) => {}) {
    User.changePassword(user.role, passObj, (err, msg) => {
      if (err) return cb(err);
      let firstname = user.name.split(" ")[0];
      let now = dateFormat(Date.now(), DATE_TYPE.inDepthDate);
      return cb(null, {
        msg,
        title: "Password Reset Alert!",
        body: `${firstname}, your password has been reset on ${now} successfully.`
      });
    });
  }

  //
  // ─── SHOW USER PROFILE ──────────────────────────────────────────────────────────
  //

  userProfile(user, cb = (err, profile) => {}) {
    User.findById(user.role, { id: user.id, isProfile: true }, (err, _user) => {
      if (err) return cb(err);
      let profile = profileFormat(user.role, _user);
      const type = user.role == "parent" ? "studentProfile" : "teacherProfile";
      return cb(null, showData(profile, type));
    });
  }
}

module.exports = new UserService();
