const jwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const { jwtConfig } = require("../config/config");
const { parentFindById } = require("../models/Student");
module.exports = passport => {
  passport.use(
    new jwtStrategy(
      {
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.secret
      },
      (payload, done) => {
        parentFindById(payload.id).then(data => {
          if (data.length > 0) {
            const user = {
              id: data[0].id,
              studentNo: data[0].Students_No,
              level: data[0].Level_Name,
              role:payload.role,
              name: data[0].Students_Name,
              imageUrl: data[0].Image
            };
            console.log(user);
            return done(null, user);
          }
          return done(null, false);
        });
      }
    )
  );
};
