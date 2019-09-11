/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 17:36:55
 * @modify date 2019-09-11 17:56:04
 * @desc [file utils]
 */
const { forOwn } = require("lodash");
const { FILE_TYPE } = require("../../common/constants");

module.exports = {
  //
  // ─── GET SPECIFIED FILE TABLE ───────────────────────────────────────────────────
  //

  getFileTable: (type, format, cb = result => {}) => {
    let objs, result;
    switch (type) {
      case FILE_TYPE.Assignment.name:
        objs = FILE_TYPE.Assignment;
        break;

      case FILE_TYPE.Report.name:
        objs = FILE_TYPE.Report;
        break;

      case FILE_TYPE.Circular.name:
        objs = FILE_TYPE.Circular;
        break;

      case FILE_TYPE.Bills.name:
        objs = FILE_TYPE.Bills;
        break;

      default:
        break;
    }

    forOwn(objs, (value, key) => {
      if (objs[key].format == format) {
        result = objs[key];
      }
    });
    return cb(result);
  }
};
