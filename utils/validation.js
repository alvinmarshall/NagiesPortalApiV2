const _ = require("lodash");

module.exports = {
  loginInputValidation: req => {
    let errors = {};
    if (_.isEmpty(_.trim(req.body.username))) {
      errors.username = "username field empty";
    }

    if (_.isEmpty(_.trim(req.body.password))) {
      errors.password = "password field empty";
    }
    return errors;
  },
  changePasswordValidation: req => {
    let errors = {};
    if (_.isEmpty(_.trim(req.body.old_password))) {
      errors.old_password = "provide current password";
    }
    if (_.isEmpty(_.trim(req.body.new_password))) {
      errors.new_password = "new password invalid";
    }
    if (_.isEmpty(_.trim(req.body.confirm_password))) {
      errors.confirm_password = "confirm password invalid";
    }
    if (!_.isEqual(req.body.new_password, req.body.confirm_password)) {
      errors.check = "new password set mismatch";
    }
    return errors;
  },

  ensureAuthentication: (err, res, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send({
        message: "authentication failed",
        error: info.message,
        status: 401
      });
      return false;
    }
    return true;
  }
};
