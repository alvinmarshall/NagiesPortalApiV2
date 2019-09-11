const userRoute = require("./components/user");
const messageRoute = require("./components/messages");
const fileRoute = require("./components/files");
module.exports = app => {
  app.use("/users", userRoute);
  app.use("/message", messageRoute);
  app.use("/file", fileRoute);
};
