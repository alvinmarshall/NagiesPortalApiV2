/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:32:38
 * @modify date 2019-09-14 23:33:43
 * @desc [File Service]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const { USER_ROLE } = require("../../common/constants");
const {
  getFileTable,
  preprareToUploadFile,
  fileFormatType,
  findAndDelete
} = require("./file.util");
const FileModel = require("./file.model.js");
const {
  showData,
  billDataFormat,
  circularFormat,
  fileDataFormat,
  uploadedDataFormat
} = require("../../common/utils/data.format");

class FileService {
  //
  // ─── GET SPECIFIED FILES ────────────────────────────────────────────────────────
  //

  static getType(user, { type, format }, cb = (err, files) => {}) {
    let fetchFrom = user.role == USER_ROLE.Parent ? user.level : user.username;
    let column =
      user.role == USER_ROLE.Parent ? "Students_No" : "Teachers_Email";
    const fileTable = getFileTable(type, format);
    if (type == "report") {
      fetchFrom = user.ref;
    }

    if (type == "report" && user.role == USER_ROLE.Teacher) {
      fetchFrom = user.username;
    }

    if (type == "circular") {
      fetchFrom = user.faculty;
    }

    return FileModel.getFile(
      { from: fetchFrom, fileTable: fileTable, column },
      (err, files) => {
        if (err) return cb(err);
        let _format;

        switch (files.type) {
          case "bill":
            _format = billDataFormat(files.data);
            break;
          case "circular":
            _format = circularFormat(files.data);
            break;
          default:
            _format = fileDataFormat(fileTable.format, files.data);
            break;
        }
        return cb(null, showData(_format));
      }
    );
  }

  //
  // ─── UPLOAD FILE ────────────────────────────────────────────────────────────────
  //

  static uploadType(
    user,
    { type, file, reportInfo },
    cb = (err, result) => {}
  ) {
    let format = fileFormatType(file.mimetype);
    let fileTable = getFileTable(type, format);
    // console.log("filetable",fileTable)

    preprareToUploadFile({ fileTable, file }, (err, uploadInfo) => {
      if (err) return cb(err);
      FileModel.saveFilePath(user, uploadInfo, reportInfo, (err, result) => {
        if (err) return cb(err);

        if (result.affectedRows == 0)
          return cb(null, { message: "file path failed to save", status: 304 });

        let _upload = uploadedDataFormat(
          result.row,
          result.path,
          result.format
        );

        return cb(null, showData(_upload));
      });
    });
  }

  //
  // ─── DELETE FILE ────────────────────────────────────────────────────────────────
  //

  static deleteType(
    user,
    { id, path, type, format },
    cb = (err, result) => {}
  ) {
    let fileTable = getFileTable(type, format);
    FileModel.deleteFilePath(id, { user, fileTable }, (err, result) => {
      if (err) return cb(err);

      if (result.affectedRows == 0)
        return cb(null, { message: "delete failed", status: 304 });

      findAndDelete(path, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
      });
    });
  }
}

module.exports = FileService;
