const jwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const { jwtConfig } = require("../config/config");
const { parentFindById, teacherFindById } = require("../models/Users");
module.exports = passport => {
  passport.use(
    new jwtStrategy(
      {
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.secret
      },
      (payload, done) => {
        switch (payload.role) {
          case "parent":
            parentFindById(payload.id)
              .then(data => {
                if (data.length > 0) {
                  const user = {
                    id: data[0].id,
                    ref: data[0].Students_No,
                    level: data[0].Level_Name,
                    role: payload.role,
                    username: data[0].Index_No,
                    name: data[0].Students_Name,
                    imageUrl: data[0].Image
                  };
                  return done(null, user);
                }
                return done(null, false);
              })
              .catch(err => console.error(err));
            break;

          case "teacher":
            teacherFindById(payload.id)
              .then(data => {
                if (data.length > 0) {
                  const user = {
                    id: data[0].id,
                    ref: data[0].Teachers_No,
                    level: data[0].Level_Name,
                    role: payload.role,
                    username: data[0].Username,
                    name: data[0].Teachers_Name,
                    imageUrl: data[0].Image
                  };
                  return done(null, user);
                }
                return done(null, false);
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
