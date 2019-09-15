/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 13:01:06
 * @modify date 2019-09-11 13:01:06
 * @desc [Student Service]
 */
//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Student = require("./student.model");
const isEmpty = require("lodash").isEmpty;
const {
  classTeacherFormat,
  showData,
  noDataFormat
} = require("../../common/utils/data.format");

class StudentService {
  //
  // ─── GET CLASS TEACHER ──────────────────────────────────────────────────────────
  //

  static teacher(user, cb = (err, teacher) => {}) {
    return Student.findTeacher(user, (err, teacher) => {
      if (err) return cb(err);
      if (isEmpty(teacher)) {
        return cb(null, noDataFormat);
      }
      let _teacher = classTeacherFormat(teacher);
      return cb(null, showData(_teacher, "studentTeachers"));
    });
  }
}
module.exports = StudentService;
