const express = require("express");
const router = express.Router();
const jsonWebToken = require("jsonwebtoken");
const { authParentWithUsername } = require("../models/Student");
const { jwtConfig } = require("../config/config");
const passport = require("passport");

// parent login
router.post("/parent", (req, res, next) => {
  authParentWithUsername(req.body.username, req.body.password)
    .then(data => {
      if (data.length > 0) {
        console.log(data[0]);
        const payload = {
          id: data[0].id,
          studentNo: data[0].Students_No,
          level: data[0].Level_Name,
          role: "parent",
          name: data[0].Students_Name,
          imageUrl: data[0].Image
        };
        jsonWebToken.sign(payload, jwtConfig.secret, (err, encode) => {
          if (err) throw err;
          res.json({
            message: "login successs",
            token: `Bearer ${encode}`,
            status: 200
          });
        });
      } else {
        res.send("failed");
      }
    })
    .catch(err => console.error(err));
});


router.get(
  "/done",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = router;
