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
  showData,
} = require("../../common/utils/data.format");
const Teacher = require("./teacher.model");

class TeacherService {
  //
  // ─── GET CLASS STUDENT ──────────────────────────────────────────────────────────
  //

  static getStudentAsync(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Teacher.findStudentAsync(user.level);
        const student = classStudentDataFormat(data);
        resolve(showData(student, "classStudent"));
      } catch (err) {
        reject(err);
      }
    });
  }

  static setRegisterAsync(data) {
    return Teacher.setClassRegisterAsync(data);
  }
}
module.exports = TeacherService;
