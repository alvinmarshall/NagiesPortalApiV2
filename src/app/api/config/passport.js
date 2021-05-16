/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 12:55:35
 * @desc users model
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const config = require("config");
const isEmpty = require("lodash").isEmpty;
const User = require("../components/user/user.model");
const USER_ROLE = require("../common/constants").USER_ROLE;
const loginPayloadFormat = require("../common/utils/data.format")
  .loginPayloadFormat;

//
// ─── PASSPORT CONFIG STRATEGY ───────────────────────────────────────────────────
//

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get("jwtConfig.secret"),
      },
      async (payload, done) => {
        try {
          const user = await getLoginPayloadAsync(payload);
          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(null, false);
        }
      }
    )
  );
};

const getLoginPayloadAsync = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      switch (payload.role) {
        case USER_ROLE.Parent:
          const student = await User.findUserAsync(payload);
          const studentData = loginPayloadFormat(USER_ROLE.Parent, student);
          return resolve(studentData);
        case USER_ROLE.Teacher:
          const teacher = await User.findUserAsync(payload);
          const teacherData = loginPayloadFormat(USER_ROLE.Teacher, teacher);
          return resolve(teacherData);
        default:
          throw new Error(`Invalid user role: ${payload.role}`);
      }
    } catch (err) {
      reject(err);
    }
  });
};
