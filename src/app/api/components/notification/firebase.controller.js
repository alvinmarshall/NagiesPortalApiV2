/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-10-01 11:09:11
 * @modify date 2019-10-01 11:09:11
 * @desc [firebase controller]
 */

const { isEmpty, trim } = require("lodash");
const { firebaseTopicPayload } = require("../../common/utils/data.format");
const dateFormat = require("dateformat");
const { DATE_TYPE } = require("../../common/constants");
const Service = require("./firebase.service");
class FirebaseController {
  static sendMessage(req, res) {
    let errors = {};
    if (!req.query.to) {
      errors.to = "provide reciever eg. parent / teacher ";
    }
    if (!req.body.title) {
      errors.title = "provde a title";
    }
    if (!req.body.message) {
      errors.message = "provide a message content";
    }
    if (!req.body.name) {
      errors.name = "provide receiver name";
    }
    if (!req.body.level) {
      errors.level = "provide level name";
    }

    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .send({ message: "field missing", status: 400, errors });

    let to = req.query.to,
      title = req.body.title,
      body = req.body.message,
      name = req.body.name,
      level = req.body.level;

    if (!(to === "parent" || to === "teacher")) {
      errors.to = "invalid receiver. eg parent or teacher";
    }
    if (isEmpty(trim(title)) || title.length < 3) {
      errors.title = "title must be atleast 3 character set";
    }
    if (isEmpty(trim(body)) || body.length < 3) {
      errors.message = "message must be atleast 3 character set";
    }
    if (isEmpty(trim(name))) {
      errors.name = "name can't be empty";
    }
    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .send({ message: "invalid field provided", status: 400, errors });

    let topic = to === "teacher" ? "teachers" : to;
    let type = topic === "teachers" ? "complaint" : "message";
    let data = {};
    if (topic === "teachers") {
      data.name = name;
    }
    data.type = type;
    data.level = level;
    const payload = firebaseTopicPayload({ title, body, data });

    Service.sendTopicMessage({ topic, payload }, (err, result) => {
      if (err) return res.status(400).send({ err });
      return res.send({ result });
    });
  }

  static changePassword(req, res) {
    let errors = {};
    if (!req.body.name) {
      errors.name = "provide login name";
    }
    if (!req.body.role) {
      errors.role = "provide login role";
    }
    let topic = trim(req.body.role);

    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .send({ message: "missing field", status: 400, errors });
    }
    if (!(topic === "parent" || topic === "teacher"))
      return res.status(400).send({
        message: "invalid field input",
        status: 400,
        errors: "role should be either parent or teacher"
      });

    let name = trim(req.body.name);
    let type = "password";
    topic = topic === "teacher" ? "teachers" : topic;
    let title = "Password Reset Alert!";
    let now = dateFormat(Date.now(), DATE_TYPE.inDepthDate);
    let body = `${
      name.split(" ")[0]
    } your password has been reset on ${now} successfully.`;
    let data = { type, name };
    const payload = firebaseTopicPayload({ title, body, data });
    Service.sendTopicMessage({ topic, payload }, (err, result) => {
      if (err) return res.status(400).send({ err });
      return res.send({ result });
    });
  }

  static uploadAssignment(req, res) {
    let errors = {};
    if (!req.body.format) {
      errors.format = "provide upload format ";
    }
    if (!req.body.level) {
      errors.level = "provide level name";
    }
    if (!req.body.sender) {
      errors.sender = "provide uploader name";
    }
    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .send({ message: "missing fields", status: 400, errors });
    let format = trim(req.body.format);
    let level = trim(req.body.level);
    let sender = trim(req.body.sender);
    if (!(format === "image" || format === "pdf")) {
      errors.format = "format type not supported. eg image / pdf";
    }
    if (isEmpty(trim(sender))) {
      errors.sender = "sender name can't be empty";
    }
    if (isEmpty(trim(level))) {
      errors.level = "level name can't be empty";
    }
    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .send({ message: "invalid fields", status: 400, errors });

    let topic = "parent";
    let type = `assignment_${format}`;
    let title = "Assignment from class teacher";
    let body = `${sender} has uploaded an assignment for ${level} class.`;
    let data = {
      type,
      level
    };
    const payload = firebaseTopicPayload({ title, body, data });
    Service.sendTopicMessage({ topic, payload }, (err, result) => {
      if (err) return res.status(400).send({ err });
      return res.send({ result });
    });
  }

  static uploadReport(req, res) {
    let errors = {};
    if (!req.body.format) {
      errors.format = "provide upload format ";
    }
    if (!req.body.level) {
      errors.level = "provide level name";
    }
    if (!req.body.sender) {
      errors.sender = "provide uploader name";
    }
    if (!req.body.studentName) {
      errors.studentName = "provide student name";
    }
    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .send({ message: "missing fields", status: 400, errors });
    let format = trim(req.body.format);
    let level = trim(req.body.level);
    let sender = trim(req.body.sender);
    let name = trim(req.body.studentName);
    if (!(format === "image" || format === "pdf")) {
      errors.format = "format type not supported. eg image / pdf";
    }
    if (isEmpty(trim(sender))) {
      errors.sender = "sender name can't be empty";
    }
    if (isEmpty(trim(level))) {
      errors.level = "level name can't be empty";
    }
    if (isEmpty(name)) {
      errors.studentName = "student name can't be empty";
    }
    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .send({ message: "invalid fields", status: 400, errors });

    let topic = "parent";
    let type = `report_${format}`;
    let title = `${name.split(" ")[0]} Terminal Report file`;
    let body = `The end of term report file for ${name}`;
    let data = {
      type,
      level,
      name
    };
    const payload = firebaseTopicPayload({ title, body, data });
    Service.sendTopicMessage({ topic, payload }, (err, result) => {
      if (err) return res.status(400).send({ err });
      return res.send({ result });
    });
  }
}

module.exports = FirebaseController;
