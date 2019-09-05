const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
let studentNo, studentName;

const { FORMAT_TYPE, DIRECTORY } = require("../utils/constants");
const mkdirp = require("mkdirp");
const { isEmpty } = require("lodash");
const { fileFieldValidation, isUploadReport } = require("../utils/validation");
const { uploadedDataFormat, showData } = require("../utils/formatResource");
const fs = require("fs");
module.exports = {
  //
  // ─── FILE UPLOADER ──────────────────────────────────────────────────────────────
  //

  uploadFile: (req, res, dbTable, user, dir = DIRECTORY.studentsUpload) => {
    isUploadReport(req, dbTable, (err, isReport) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      if (isReport) {
        studentNo = req.body.studentNo;
        studentName = req.body.studentName;
      } else {
        studentNo = undefined;
        studentName = undefined;
      }
      prepareToUploadFile(req, res, dir, (err, data) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        saveFilePathToDB(res, data, dbTable, user);
      });
    });
  },

  //
  // ─── DELETE A FILE ──────────────────────────────────────────────────────────────
  //

  deleteFile: (req, res, path) => {
    const filePath = `./public/${path}`;
    fs.stat(filePath, err => {
      if (err) {
        console.error(err);
        res
          .status(404)
          .send({ message: "file not found", errors: err, status: 404 });
        return;
      }
      fs.unlink(filePath, err => {
        if (err) {
          res
            .status(500)
            .send({
              message: "something went wrong try again",
              status: 500,
              errors: err
            });
          return;
        }
        res.send({ message: "file deleted successful",status:200 });
      });
    });
  }
};

//
// ─── CREATE DIRECTIORY ──────────────────────────────────────────────────────────
//

const directoryUtil = dir => {
  if (!isEmpty(dir)) {
    mkdirp(dir, err => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
};

//
// ─── SAVE UPLOADED PATH TO DATABASE ─────────────────────────────────────────────
//

const saveFilePathToDB = (res, file, dbTable, user) => {
  const index = studentNo || user.level;
  const name = studentName || user.username;
  const email = user.username;
  const sql = `INSERT INTO ${dbTable} SET Students_No = ?,Students_Name = ?,Teachers_Email = ?,Report_File = ?`;
  db.query(sql, [index, name, email, file.destination])
    .then(row => {
      const _data = uploadedDataFormat(row, file.destination, file.format);
      res.send(showData(_data));
    })
    .catch(err => {
      err => console.error(err);
    });
};

//
// ─── FILE FORMAT TYPE ───────────────────────────────────────────────────────────
//

const fileFormatType = extension => {
  switch (extension) {
    case "image/jpeg":
    case "image/png":
      return FORMAT_TYPE.IMAGE;
    case "application/pdf":
      return FORMAT_TYPE.PDF;
    default:
      return FORMAT_TYPE.Other;
  }
};

//
// ─── PREPARE FOR AN UPLOAD ──────────────────────────────────────────────────────
//

const prepareToUploadFile = (req, res, dir, cb) => {
  fileFieldValidation(req, err => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    let fileToUpload = req.files.file;
    let publicPath = `public/${dir}`;
    let filePath = `${publicPath}/${fileToUpload.name}`;
    fileToUpload.mv(filePath, err => {
      if (err) {
        console.error(err);
        return cb({ message: "something went wrong, try again" });
      }
      const format = fileFormatType(fileToUpload.mimetype);
      const destination = `${dir}/${fileToUpload.name}`;
      return cb(null, { format: format, destination: destination });
    });
  });
};
