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
  static async getClassTeacher(req, res) {
    try {
      const user = req.user;
      const data = await Service.getTeacherAsync(user);
      return res.send(data);
    } catch (err) {
      return res.status(500).send({ message: "Internal error", status: 500 });
    }
  }
}
module.exports = StudentController;
