/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:49:41
 * @modify date 2019-09-11 12:54:02
 * @desc resource formatter utility
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const { USER_ROLE, DATE_TYPE } = require("../../common/constants");
const forEach = require("lodash").forEach;
const isEmpty = require("lodash").isEmpty;
const trim = require("lodash").trim;
const dateFormat = require("dateformat");
module.exports = {
  //
  // ─── SHOW DATA FORMAT──────────────────────────────────────────────────────────────────
  //

  showData: (data, type = "data") => {
    return { status: 200, count: data.length, [`${type}`]: data };
  },

  //
  // ─── INVALID INPUT FORMAT ───────────────────────────────────────────────────────
  //

  invalidInputFormat: (err) => {
    return { message: "field empty", status: 400, errors: err };
  },

  //
  // ─── NO DATA FORMAT ─────────────────────────────────────────────────────────────
  //

  noDataFormat: () => {
    return { message: "No Data Available", status: 404, count: 0 };
  },

  //
  // ─── AUTHENTICATION FAILED FORMAT ───────────────────────────────────────────────
  //

  authenticationFailedFormat: () => {
    return { message: "authentication failed", status: 401 };
  },

  //
  // ─── LOGIN PAYLOAD FORMAT ───────────────────────────────────────────────────────
  //

  loginPayloadFormat: (role, data) => {
    if (!data) return null;
    switch (role) {
      case USER_ROLE.Parent:
        return {
          id: data.id,
          ref: data.Students_No,
          level: data.Level_Name,
          role: USER_ROLE.Parent,
          username: data.Index_No,
          name: data.Students_Name,
          imageUrl: data.Image,
          faculty: data.Faculty_Name,
        };
      case USER_ROLE.Teacher:
        return {
          id: data.id,
          ref: data.Teachers_No,
          level: data.Level_Name,
          role: USER_ROLE.Teacher,
          username: data.Username,
          name: data.Teachers_Name,
          imageUrl: data.Image,
          faculty: data.Faculty_Name,
        };
      default:
        return null;
    }
  },

  //
  // ─── PROFILE FORMAT ─────────────────────────────────────────────────────────────
  //

  profileFormat: (role, data) => {
    switch (role) {
      case USER_ROLE.Parent:
        return {
          studentNo: data.Students_No,
          studentName: data.Students_Name,
          gender: data.Gender,
          dob: dateFormat(data.Dob, DATE_TYPE.shortDate),
          admissionDate: dateFormat(data.Admin_Date, DATE_TYPE.shortDate),
          section: data.Section_Name,
          faculty: data.Faculty_Name,
          level: data.Level_Name,
          semester: data.Semester_Name,
          index: data.Index_No,
          guardian: data.Guardian_Name,
          contact: data.Guardian_No,
          imageUrl: data.Image,
        };
      case USER_ROLE.Teacher:
        return {
          uid: data.id,
          ref: data.Teachers_No,
          name: data.Teachers_Name,
          dob: dateFormat(data.Dob, DATE_TYPE.shortDate),
          gender: data.Gender,
          contact: data.Contact,
          admissionDate: dateFormat(data.Admin_Date, DATE_TYPE.shortDate),
          facultyName: data.Faculty_Name,
          level: data.Level_Name,
          username: data.Username,
          imageUrl: data.Image,
        };
      default:
        return {};
    }
  },

  //
  // ─── CLASS TEACHER FORMAT ───────────────────────────────────────────────────────
  //

  classTeacherFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        id: data[key].id,
        uid: data[key].Teachers_No,
        teacherName: data[key].Teachers_Name,
        gender: data[key].Gender,
        contact: data[key].Contact,
        imageUrl: data[key].Image,
      });
    });
    return result;
  },

  //
  // ─── MESSAGES FORMAT ─────────────────────────────────────────────────────────────
  //

  messageDataFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        uid: data[key].id,
        sender: data[key].Message_BY,
        level: data[key].Message_Level,
        content: data[key].Message,
        status: data[key].M_Read,
        date: dateFormat(data[key].M_Date, DATE_TYPE.fullDate),
      });
    });
    return result;
  },

  //
  // ─── CIRCULAR FORMAT ────────────────────────────────────────────────────────────
  //

  circularFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        id: data[key].id,
        cid: data[key].CID,
        fileUrl: data[key].FileName,
        date: dateFormat(data[key].CID_Date, DATE_TYPE.shortDate),
      });
    });
    return result;
  },

  //
  // ─── FILE DATA FORMAT ───────────────────────────────────────────────────────────
  //

  fileDataFormat: (type, data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        id: data[key].id,
        studentNo: data[key].Students_No,
        studentName: data[key].Students_Name,
        teacherEmail: data[key].Teachers_Email,
        fileUrl: data[key].Report_File,
        format: type,
        date: dateFormat(data[key].Report_Date, DATE_TYPE.simpleDate),
      });
    });
    return result;
  },

  //
  // ─── BILLING FORMAT ─────────────────────────────────────────────────────────────
  //

  receiptDataFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        id: data[key].id,
        studentNo: data[key].Ref_No,
        studentName: data[key].Name,
        level: data[key].Level,
        fileUrl: data[key].Image,
        date: dateFormat(data[key].Date, DATE_TYPE.simpleDate),
      });
    });
    return result;
  },

  //
  // ─── BILLING FORMAT ─────────────────────────────────────────────────────────────
  //

  billDataFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        id: data[key].id,
        studentNo: data[key].Students_No,
        studentName: data[key].Students_Name,
        sender: data[key].Uploader,
        fileUrl: data[key].Bill_File,
        date: dateFormat(data[key].Report_Date, DATE_TYPE.simpleDate),
      });
    });
    return result;
  },

  //
  // ─── COMPLAINT MESSAGE ──────────────────────────────────────────────────────────
  //

  complaintDataFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        uid: data[key].id,
        studentNo: data[key].Students_No,
        studentName: data[key].Students_Name,
        level: data[key].Level_Name,
        guardianName: data[key].Guardian_Name,
        guardianContact: data[key].Guardian_No,
        teacherName: data[key].Teachers_Name,
        message: data[key].Message,
        date: dateFormat(data[key].Message_Date, DATE_TYPE.fullDate),
      });
    });
    return result;
  },

  //
  // ─── UPLOAD FORMAT ──────────────────────────────────────────────────────────────
  //

  uploadedDataFormat: (row, path, format) => {
    return {
      id: row.insertId,
      fileUrl: path,
      format: format,
    };
  },

  //
  // ─── FIREBASE MESSAGE PAYLOAD ───────────────────────────────────────────────────
  //

  firebaseTopicPayload: ({ title, body, data, image }) => {
    return {
      data: {
        title,
        body,
        type: data.type,
        level: !isEmpty(trim(data.level)) ? trim(data.level) : "",
        name: !isEmpty(trim(data.name)) ? trim(data.name) : "",
        image: !isEmpty(trim(image)) ? trim(image) : "",
        sound: "default",
        vibrate: "true",
        status: "200",
      },
    };
  },

  //
  // ─── CLASS STUDENT FORMAT ───────────────────────────────────────────────────────
  //

  classStudentDataFormat: (data) => {
    let result = [];
    forEach(data, (_, key) => {
      result.push({
        id: data[key].id,
        studentNo: data[key].Students_No,
        studentName: data[key].Students_Name,
        gender: data[key].Gender,
        indexNo: data[key].Index_No,
        imageUrl: data[key].Image,
      });
    });
    return result;
  },
};
