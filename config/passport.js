const jwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const { jwtConfig } = require("../config/config");
const _ = require("lodash");
const { authenticateWithId } = require("../models/Users");
const { USER_ROLE } = require("../utils/constants");
const { loginPayloadFormat } = require("../utils/formatResource");
module.exports = passport => {
  passport.use(
    new jwtStrategy(
      {
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.secret
      },
      (payload, done) => {
        switch (payload.role) {
          case USER_ROLE.Parent:
            authenticateWithId(USER_ROLE.Parent, payload.id)
              .then(data => {
                return data[0];
              })
              .then(data => {
                if (_.isEmpty(data)) {
                  return done(null, false);
                }
                const user = loginPayloadFormat(USER_ROLE.Parent, data);
                return done(null, user);
              })
              .catch(err => console.error(err));
            break;

          case USER_ROLE.Teacher:
            authenticateWithId(USER_ROLE.Teacher, payload.id)
              .then(data => {
                return data[0];
              })
              .then(data => {
                if (_.isEmpty(data)) {
                  return done(null, false);
                }
                const user = loginPayloadFormat(USER_ROLE.Teacher, data);
                return done(null, user);
              })
              .catch(err => console.error(err));
            break;

          default:
            break;
        }
      }
    )
  );
};
