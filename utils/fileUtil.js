const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
let studentNo,
  studentName = undefined;

const {
  FORMAT_TYPE,
  TABLE_REPORT_PDF,
  TABLE_REPORT_IMAGE,
  DIRECTORY
} = require("../utils/constants");
const mkdirp = require("mkdirp");
const { isEmpty, trim } = require("lodash");
const { fileFieldValidation } = require("../utils/validation");
const { uploadedDataFormat, showData } = require("../utils/formatResource");
module.exports = {
  //
  // ─── FILE UPLOADER ──────────────────────────────────────────────────────────────
  //

  uploadFile: (req, res, dbTable, user, dir = DIRECTORY.studentsUpload) => {
    if (checkIfReportFile(req, res, dbTable)) {
      prepareToUploadFile(req, res, dbTable, dir, user);
    }
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

const saveFilePathToDB = (res, format, destination, dbTable, user) => {
  const index = studentNo || user.level;
  const name = studentName || user.username;
  const email = user.username;
  const sql = `INSERT INTO ${dbTable} SET Students_No = ?,Students_Name = ?,Teachers_Email = ?,Report_File = ?`;
  db.query(sql, [index, name, email, destination])
    .then(row => {
      const _data = uploadedDataFormat(row, destination, format);
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
// ─── DEALING WITH REPORT UPLOAD ─────────────────────────────────────────────────
//

const checkIfReportFile = (req, res, dbTable) => {
  if (dbTable === TABLE_REPORT_PDF || dbTable === TABLE_REPORT_IMAGE) {
    let errors = {};
    if (isEmpty(trim(req.body.studentNo))) {
      errors.studentNo = "Student number required to upload report";
    }
    if (isEmpty(trim(req.body.studentName))) {
      errors.studentName = "Student name required to upload report";
    }
    if (!isEmpty(errors)) {
      res
        .status(400)
        .send({ message: "Field empty", status: 400, errors: errors });
      return false;
    }
    studentNo = req.body.studentNo;
    studentName = req.body.studentName;
    return true;
  }
  return true;
};

//
// ─── PREPARE FOR AN UPLOAD ──────────────────────────────────────────────────────
//

const prepareToUploadFile = (req, res, dbTable, dir, user) => {
  if (fileFieldValidation(req, res)) {
    let fileToUpload = req.files.file;
    if (isEmpty(fileToUpload)) {
      res.status(400).send({ message: "Set form field to file", status: 400 });
      return;
    }
    directoryUtil(dir);
    let filepath = `${dir}/${fileToUpload.name}`;
    fileToUpload.mv(filepath, err => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Something went wrong", status: 500 });
        return;
      }
      const format = fileFormatType(fileToUpload.mimetype);
      saveFilePathToDB(res, format, filepath, dbTable, user);
    });
  }
};
