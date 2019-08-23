const express = require("express");
const router = express.Router();
const jsonWebToken = require("jsonwebtoken");
const {
  authParentWithUsername,
  authTeacherWithUsername,
  changeAccountPassword
} = require("../models/Users");
const { jwtConfig } = require("../config/config");
const passport = require("passport");
const {
  changePasswordValidation,
  ensureAuthentication
} = require("../utils/validation");
const {USER_ROLE} = require("../utils/constants");

//#endregion parent login
router.post("/parent", (req, res, next) => {
  authParentWithUsername(req.body.username, req.body.password)
    .then(data => {
      if (data.length === 0) {
        res.status(401).send({ message: "authentication failed", status: 401 });
        return;
      }
      const payload = {
        id: data[0].id,
        ref: data[0].Students_No,
        level: data[0].Level_Name,
        role: USER_ROLE.Parent,
        username: data[0].Index_No,
        name: data[0].Students_Name,
        imageUrl: data[0].Image
      };
      jsonWebToken.sign(payload, jwtConfig.secret, (err, encode) => {
        if (err) throw err;
        res.json({
          message: "Login Successful",
          uuid: payload.id,
          token: `Bearer ${encode}`,
          imageUrl: payload.imageUrl,
          role: payload.role,
          status: 200
        });
      });
    })
    .catch(err => console.error(err));
});
//#endregion

//#endregion teacher login
router.post("/teacher", (req, res, next) => {
  authTeacherWithUsername(req.body.username, req.body.password).then(data => {
    if (data.length === 0) {
      res.status(401).send({ message: "authentication failed", status: 401 });
      return;
    }
    const payload = {
      id: data[0].id,
      ref: data[0].Teachers_No,
      level: data[0].Level_Name,
      role: USER_ROLE.Teacher,
      username: data[0].Username,
      name: data[0].Teachers_Name,
      imageUrl: data[0].Image
    };
    jsonWebToken.sign(payload, jwtConfig.secret, (err, encode) => {
      if (err) throw err;
      res.json({
        message: "Login Successful",
        uuid: payload.id,
        token: `Bearer ${encode}`,
        imageUrl: payload.imageUrl,
        role: payload.role,
        status: 200
      });
    });
  });
});
//#endregion

router.post("/change_password", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (ensureAuthentication(res, err, info)) {
      const errors = changePasswordValidation(req);
      if (errors.length > 0) {
        res
          .status(400)
          .send({ message: "field empty", status: 400, errors: errors });
      } else {
        const changePass = {
          id: user.id,
          old: req.body.old_password,
          new: req.body.new_password,
          confirm: req.body.confirm_password
        };
        changeAccountPassword(res, user.role, changePass);
      }
    }
  })(req, res, next);
});

router.get(
  "/done",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = router;
