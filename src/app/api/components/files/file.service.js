/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:32:38
 * @modify date 2019-09-11 16:32:38
 * @desc [File Service]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const { USER_ROLE } = require("../../common/constants");
const { getFileTable } = require("./file.util");
const FileModel = require("./file.model.js");
const {
  showData,
  billDataFormat,
  circularFormat,
  fileDataFormat
} = require("../../common/utils/data.format");

class FileService {
  //
  // ─── GET SPECIFIED FILES ────────────────────────────────────────────────────────
  //

  static getType(user, { type, format }, cb = (err, files) => {}) {
    let fetchFrom = user.role == USER_ROLE.Parent ? user.ref : user.username;
    let column =
      user.role == USER_ROLE.Parent ? "Students_No" : "Teachers_Email";
    let ftable = getFileTable(type, format, result => {
      return result;
    });
    return FileModel.getFile(
      { from: fetchFrom, fileTable: ftable, column },
      (err, files) => {
        if (err) return cb(err);
        let _format;

        if (files.type == "bill") {
          _format = billDataFormat(files.data);
        }
        if (files.type == "circular") {
          _format = circularFormat(files.data);
        }
        if (files.type == "assignment" || files.type == "report")
          _format = fileDataFormat(type, files.data);

        return cb(null, showData(_format, files.type));
      }
    );
  }
}

module.exports = FileService;
