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
  noDataFormat,
} = require("../../common/utils/data.format");

class StudentService {
  //
  // ─── GET CLASS TEACHER ──────────────────────────────────────────────────────────
  //

  static getTeacherAsync(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Student.findTeacherAsync(user);
        if (isEmpty(data)) {
          return resolve(noDataFormat);
        }
        const teacher = classTeacherFormat(data);
        return resolve(showData(teacher, "studentTeachers"));
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = StudentService;
