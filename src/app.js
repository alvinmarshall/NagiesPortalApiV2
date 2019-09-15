const debug = require("debug")("server:debug");
const config = require("config");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const firebase = require("firebase-admin");

//middleware
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));
// file upload
app.use(fileUpload());
//set passport
require("./app/api/config/passport")(passport);
//set route
require("./app/api/router")(app);

//path
app.use(express.static(path.join(__dirname, config.get("ASSET_DIR"))));
// firebase config
firebase.initializeApp({
  credential: firebase.credential.cert(config.get("serviceKey")),
  databaseURL: config.get("databaseUrl.url")
});

// // catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// // error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ message: "endpoint unavaialble", status: 404 });
  next();
});

const listen = app.listen(config.get("port"), () => {
  debug(
    `server is running on port: ${config.get("port")} and in ${config.get(
      "name"
    )}`
  );
  console.log(
    `server is running on port: ${config.get("port")} and in ${config.get(
      "name"
    )}`
  );
});

module.exports = app;
module.exports.port = listen.address().port;
