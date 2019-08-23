module.exports = {
  changePasswordValidation: req => {
    const errors = [];
    if (!req.body.old_password) {
      errors.push({ old_password: "provide current password" });
    }
    if (!req.body.new_password) {
      errors.push({ new_password: "new password invalid" });
    }
    if (!req.body.confirm_password) {
      errors.push({ confirm_password: "confirm password invalid" });
    }
    if (req.body.new_password !== req.body.confirm_password) {
      errors.push({ check: "new password set mismatch" });
    }
    return errors;
  },

  ensureAuthentication: (res,err, info) => {
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
