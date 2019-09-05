/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 19:06:34
 * @modify date 2019-08-23 19:06:34
 * @desc index route
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const express = require("express");
const router = express.Router();

//
// ─── HOME PAGE ──────────────────────────────────────────────────────────────────
//

/* GET home page. */
router.get("/api", function(req, res) {
  res.send({ message: `Nagie's Portal running on port ${process.env.PORT}` });
});

module.exports = router;
