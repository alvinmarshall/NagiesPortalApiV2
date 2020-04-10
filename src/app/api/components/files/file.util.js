/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 17:36:55
 * @modify date 2019-09-11 17:56:04
 * @desc [file utils]
 */
const { forOwn } = require("lodash");
const { FILE_TYPE, FORMAT_TYPE } = require("../../common/constants");
const fs = require("fs");
module.exports = {
  //
  // ──────────────────────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: G E T   S P E C I F I E D   F I L E   T A B L E : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────────────────────────
  //

  getFileTable: (type, format) => {
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
      case FILE_TYPE.TimeTable.name:
        objs = FILE_TYPE.TimeTable;
        break;
      case FILE_TYPE.Receipt.name:
        objs = FILE_TYPE.Receipt;
        break;

      default:
        break;
    }

    forOwn(objs, (value, key) => {
      if (objs[key].format == format) {
        result = objs[key];
      }
    });
    return result;
  },

  //
  // ──────────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: F I L E   F O R M A T   T Y P E : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────────
  //

  fileFormatType: mimetype => {
    switch (mimetype) {
      case "image/jpeg":
      case "image/png":
        return FORMAT_TYPE.IMAGE;
      case "application/pdf":
        return FORMAT_TYPE.PDF;
      default:
        return FORMAT_TYPE.Other;
    }
  },

  //
  // ──────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: U P L O A D I N G   F I L E : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────
  //

  preprareToUploadFile: ({ fileTable, file }) => {
    return new Promise((resolve, reject) => {
      try {
        let fileToUpload = file,
          publicPath = `public/${fileTable.location}`,
          filePath = `${publicPath}/${fileToUpload.name}`;
        fileToUpload.mv(filePath, err => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          fs.chmod(filePath, 0707, err => {
            if (err) {
              console.error(err);
              return reject(err);
            }
          });

          let destination = `${fileTable.location}/${fileToUpload.name}`;
          resolve({ fileTable, destination });
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  //
  // ────────────────────────────────────────────────────────────── I ──────────
  //   :::::: D E L E T E   F I L E : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────
  //

  findAndDeleteAsync: path => {
    return new Promise(async (resolve, reject) => {
      try {
        let publicPath = `public/${path}`;
        fs.stat(publicPath, err => {
          if (err) {
            console.error(err);
            return resolve(false);
          }

          fs.unlink(publicPath, err => {
            if (err) {
              console.error(err);
              return resolve(false);
            }
            return resolve(true);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  preprareToUploadVideoAsync: ({ info, file }) => {
    return new Promise((resolve, reject) => {
      try {
        let fileToUpload = file,
          publicPath = `public/${info.location}`,
          filePath = `${publicPath}/${fileToUpload.name}`;
        fileToUpload.mv(filePath, err => {
          if (err) {
            console.error(err);
            return reject(err);
          }

          fs.chmod(filePath, 0707, err => {
            if (err) {
              return reject(err);
            }
          });

          let path = `${info.location}/${fileToUpload.name}`;
          path.trim();
          resolve({ path, info });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};
