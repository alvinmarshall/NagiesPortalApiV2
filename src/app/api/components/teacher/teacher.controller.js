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

  static async getClassStudent(req, res) {
    try {
      if (req.user.role !== "teacher")
        return res.status(403).send({
          message: "current permission can't access this route",
          status: 403,
        });

      const data = await Service.getStudentAsync(req.user);
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res.send({ message: "Internal error", status: 500 });
    }
  }

  static async setClassRegister(req, res) {
    try {
      const { register } = req.body;
      const data = await Service.setRegisterAsync(register);
      return res.send({ data, status: 200 });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: 500, message: "Internal error" });
    }
  }
}
module.exports = TeacherController;
