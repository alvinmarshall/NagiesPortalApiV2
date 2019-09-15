/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 13:00:25
 * @modify date 2019-09-11 13:00:25
 * @desc [Student Controller]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const Service = require("./student.service");
class StudentController {
  static getClassTeacher(req, res) {
    return Service.teacher(req.user, (err, teacher) => {
      if (err) return res.send(err);
      return res.send(teacher);
    });
  }
}
module.exports = StudentController;
