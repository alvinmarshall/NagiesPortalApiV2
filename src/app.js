const debug = require("debug")("server:debug");
const config = require("config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

//middleware
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set passport
require("./app/api/config/passport")(passport);
//set route
require("./app/api/router")(app);

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
