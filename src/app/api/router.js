/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-12 23:44:06
 * @modify date 2019-09-12 23:44:06
 * @desc [api route]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const userRoute = require("./components/user");
const messageRoute = require("./components/messages");
const fileRoute = require("./components/files");
const studentRoute = require("./components/student");
const teacherRoute = require("./components/teacher");
const homeRoute = require("./components/home");

//
// ────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   R O U T E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────
//

module.exports = app => {
  app.use("/api/v1/", homeRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/message", messageRoute);
  app.use("/api/v1/file", fileRoute);
  app.use("/api/v1/students", studentRoute);
  app.use("/api/v1/teacher", teacherRoute);
};
