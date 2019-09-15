const express = require("express");
const router = express.Router();
const config = require("config");
router.get("/", (req, res) => {
  res.send({
    message: "Welcome to Nagie's Angels Microservice",
    version: "1.0.1",
    status: `${config.get("name")} running on port ${config.get("port")}`,
    company: "iNfordas Ghana Limited © 2019",
    aboutUs: "http://infordasgh.com/AboutUs",
    contactUs: "http://infordasgh.com/contact"
  });
});
module.exports = router;
