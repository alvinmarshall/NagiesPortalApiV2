/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:52:42
 * @modify date 2019-08-23 18:52:42
 * @desc launch application
 */

//
// ─── LOCAL ENV ──────────────────────────────────────────────────────────────────
// NOTE load local env only in development
//

if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const passport = require("passport");
const studentRouter = require("./routes/student");
const teacherRouter = require("./routes/teacher");
const fileUpload = require("express-fileupload");
const firebase = require("firebase-admin");
const { serviceKey, databaseUrl } = require("./config/config");
const app = express();

//
// ─── MIDDLE WARE ────────────────────────────────────────────────────────────────
//

//passport config
require("./config/passport")(passport);
// morgan
app.use(logger("dev"));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//path
app.use(express.static(path.join(__dirname, process.env.ASSET_DIR)));
// file upload
app.use(fileUpload());

// firebase config
firebase.initializeApp({
  credential: firebase.credential.cert(serviceKey),
  databaseURL: databaseUrl.url
});

//routes
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRouter);

// download route
app.get("/download", (req, res) => {
  const filePath = `/public/${req.query.path}`;
  const fileName = path.basename(filePath);
  res.download(__dirname + filePath, fileName, err => {
    if (err) {
      res.send({ message: "No file found", error: err });
      return;
    }
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ message: "endpoint unavaialble", status: 404 });
  next();
});

// console.log(serviceKey)
module.exports = app;
