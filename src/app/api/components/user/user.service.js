const jsonWebToken = require("jsonwebtoken");
const config = require("config");
const {
  loginPayloadFormat,
  profileFormat,
  showData
} = require("../../common/utils/data.format");
const User = require("./user.model");
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
          status: 200
        };
        return cb(null, userInfo);
      }
    );
  }

  //
  // ─── CHANGE USER PASSWORD ───────────────────────────────────────────────────────
  //

  resetPassword(role, passObj, cb = (err, msg) => {}) {
    User.changePassword(role, passObj, (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  }

  //
  // ─── SHOW USER PROFILE ──────────────────────────────────────────────────────────
  //

  userProfile(user, cb = (err, profile) => {}) {
    User.findById(user.role, { id: user.id, isProfile: true }, (err, _user) => {
      if (err) return cb(err);
      let profile = profileFormat(user.role, _user);
      const type = user.role ? "studentProfile" : "teacherProfile";
      return cb(null, showData(profile, type));
    });
  }
}

module.exports = new UserService();
