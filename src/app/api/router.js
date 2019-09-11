const userRoute = require("./components/user");
const messageRoute = require("./components/messages");

module.exports = app => {
  app.use("/users", userRoute);
  app.use("/message", messageRoute);
};
