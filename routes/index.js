var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.send({ message: `Nagie's Portal running on port ${process.env.PORT}` });
});

module.exports = router;
