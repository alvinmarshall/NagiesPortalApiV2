const jsonWebToken = require("jsonwebtoken");
const config = require("config");
const {
  loginPayloadFormat,
  profileFormat,
  firebaseTopicPayload,
  showData,
} = require("../../common/utils/data.format");
const User = require("./user.model");
const dateFormat = require("dateformat");
const { DATE_TYPE } = require("../../common/constants");
const Firebase = require("../notification/firebase.service");
class UserService {
  //
  // ─── GENERATE JWT TOKEN FOR LOGIN USER ──────────────────────────────────────────
  //

  generateTokenAsync(role, data) {
    return new Promise((resolve, reject) => {
      try {
        const payload = loginPayloadFormat(role, data);
        if (!payload) return reject(new Error("Unknown user"));
        jsonWebToken.sign(
          payload,
          config.get("jwtConfig.secret"),
          (err, encode) => {
            if (err) return reject(err);
            return resolve({ token: `Bearer ${encode}`, payload });
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  //
  // ─── CHANGE USER PASSWORD ───────────────────────────────────────────────────────
  //

  resetPasswordAsync(user, passObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.changeUserPasswordAsync(user.role, passObj);
        const firstname = user.name.split(" ")[0];
        const now = dateFormat(Date.now(), DATE_TYPE.inDepthDate);
        const status = result === true ? "was successful" : "failed";

        const topic = user.role === "teacher" ? "teachers" : user.role;

        const title = "Password Reset Alert!";
        const body = `${firstname}, your password reset attempt ${status} on ${now}`;
        const data = {
          type: "password",
          name: user.name,
        };

        const payload = firebaseTopicPayload({ title, body, data });
        const _ = await Firebase.sendTopicMessageAsync({ topic, payload });
        console.log("fcm", _);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  //
  // ─── SHOW USER PROFILE ──────────────────────────────────────────────────────────
  //

  userProfileAsync(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await User.getProfileAsync(user);
        const profile = profileFormat(user.role, data);
        const type =
          user.role == "parent" ? "studentProfile" : "teacherProfile";
        return resolve(showData(profile, type));
      } catch (err) {
        reject(err);
      }
    });
  }

  getAuthenticatedUserAsync(role, credentials) {
    return User.findAuthUserAsync(role, credentials);
  }
}

module.exports = new UserService();
