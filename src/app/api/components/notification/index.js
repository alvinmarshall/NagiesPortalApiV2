/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-10-01 11:12:03
 * @modify date 2019-10-01 11:12:03
 * @desc [firebase route for web]
 */
const express = require("express");
const router = express.Router();
const Controller = require('./firebase.controller')
router.post("/assignment",Controller.uploadAssignment)
router.post("/report",Controller.uploadReport)
router.post("/password",Controller.changePassword)
router.post("/send_message",Controller.sendMessage)
module.exports = router;
