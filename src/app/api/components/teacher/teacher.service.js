/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-12 23:10:51
 * @modify date 2019-09-12 23:43:44
 * @desc [teacher service]
 */
//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const {
  classStudentDataFormat,
  showData
} = require("../../common/utils/data.format");
const Teacher = require("./teacher.model");

class TeacherService {
  //
  // ─── GET CLASS STUDENT ──────────────────────────────────────────────────────────
  //

  static getStudent(user, cb = (err, student) => {}) {
    return Teacher.findStudent(user.level, (err, student) => {
      if (err) return cb(err);
      let _student = classStudentDataFormat(student);
      return cb(null, showData(_student, "classStudent"));
    });
  }

  static setRegisterAsync(data){
    return Teacher.setClassRegisterAsync(data)
  }
}
module.exports = TeacherService;
