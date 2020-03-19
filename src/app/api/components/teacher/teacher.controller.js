/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-12 23:04:49
 * @modify date 2019-09-12 23:54:48
 * @desc [teacher controller]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Service = require("./teacher.service");

class TeacherController {
  //
  // ─── GET STUDENTS ───────────────────────────────────────────────────────────────
  //

  static getClassStudent(req, res) {
    if (req.user.role != "teacher")
      return res.status(403).send({
        message: "current permission can't access this route",
        status: 403
      });
    return Service.getStudent(req.user, (err, student) => {
      if (err) return res.send(err);
      return res.send(student);
    });
  }

  static async setClassRegister(req, res) {
    try {
      const {register} = req.body;
      const data = await Service.setRegisterAsync(register);
      return res.send({ data, status: 200 });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: 500, message: "Internal error" });
    }
  }
}
module.exports = TeacherController;
