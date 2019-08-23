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
app.use(express.static(path.join(__dirname, process.env.ASSERT_DIR)));

//routes
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/students", studentRouter);

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
module.exports = app;
