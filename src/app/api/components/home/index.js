/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-16 20:37:17
 * @modify date 2019-09-16 20:37:17
 * @desc [home route]
 */

//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: I M P O R T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();
const config = require("config");
//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: H O M E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
// @route GET api/v1
// @desc home route
// @access Public

router.get("/", (req, res) => {
  res.send({
    message: "Welcome to Nagie's Angels Microservice",
    version: config.get('version'),
    status: `${config.get("name")} running on port ${config.get("port")}`,
    company: `${config.get("about.company")} © ${new Date().getFullYear()}`,
    aboutUs: config.get("about.aboutUrl"),
    contactUs: config.get("about.contactUrl")
  });
});
module.exports = router;
