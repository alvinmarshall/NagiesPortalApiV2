module.exports = {
  stringToBoolean: value => {
    switch (value) {
      case "true":
        return true;

      case "false":
        return false;

      default:
        return false;
    }
  }
};
