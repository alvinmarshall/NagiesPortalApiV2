const userRoute = require("./components/user");

module.exports = app => {
  app.use("/users", userRoute);
};
