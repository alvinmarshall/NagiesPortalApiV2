/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 14:10:21
 * @modify date 2019-09-11 14:10:21
 * @desc [Message Controller]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Service = require("./message.service");
const { validationResult } = require("express-validator");
class MessageController {
  //
  // ─── GET SPECIFIC MESSAGE TYPE ──────────────────────────────────────────────────
  //

  static async getMessage(req, res) {
    try {
      const { from } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const paging = {
        start: (page - 1) * limit,
        end: limit,
      };
      const user = req.user;
      const data = await Service.messageAsync({ user, from, paging });
      return res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal error" });
    }
  }

  //
  // ─── SEND SPECIFIED MESSAGE ─────────────────────────────────────────────────────
  //

  static async sendMessage(req, res) {
    try {
      const user = req.user;
      const error = [];
      const recipient = req.query.to;
      const messagebody = req.body;

      if (user.role === "parent") {
        if (!messagebody.teacherName) {
          error.push({ teacherName: "teacher name not set" });
        }
        if (recipient === "parent") {
          error.push({ to: "sorry, you can't send message to yourself" });
        }
      }

      if (user.role === "teacher") {
        if (recipient === "teacher") {
          error.push({ to: "sorry, you can't send message to yourself" });
        }
      }
      const valderr = validationResult(req); // express validator error
      if (!valderr.isEmpty()) {
        return res
          .status(400)
          .send({ message: "field invalid", status: 400, errors: valderr });
      }

      if (error.length > 0)
        return res
          .status(400)
          .send({ message: "field invalid", status: 400, error: error });

      const data = await Service.sendMessageAsync({
        recipient,
        user,
        message: messagebody,
      });
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: `Internal error`, status: 500 });
    }
  }

  static async deleteMessageById(req, res) {
    try {
      let errors = {};

      if (!req.params.id) errors.id = "provide message id path";

      if (!req.params.type) errors.type = "provide message type path";

      if (!(req.params.type == "complaint" || req.params.type == "message"))
        errors.invalidPath = "invalid message type";

      if (Object.keys(errors).length > 0)
        return res
          .status(400)
          .send({ message: "field not set", status: 400, errors });

      let { type, id } = req.params;
      type = type === "complaint" ? "complaints" : type;
      const data = await Service.deleteMessageByIdAsync({ type, id });
      const status = data === true ? "Successfully" : "Failed";
      return res.send({ message: `Delete message ${status}` });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal error" });
    }
  }

  //
  // ─── GET SENT MESSAGE BY USER ───────────────────────────────────────────────────
  //

  static async getSentMessage(req, res) {
    try {
      let user = req.user;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const paging = {
        start: (page - 1) * limit,
        end: limit,
      };
      const data = await Service.sentMessageAsync({ user, paging });
      return res.send(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal error" });
    }
  }
}

module.exports = MessageController;
