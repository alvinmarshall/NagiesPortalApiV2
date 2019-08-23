/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:59:51
 * @modify date 2019-08-23 18:59:51
 * @desc string to boolean utility
 */
module.exports = {
  //
  // ─── STRING TO BOOLEAN ──────────────────────────────────────────────────────────
  //

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
