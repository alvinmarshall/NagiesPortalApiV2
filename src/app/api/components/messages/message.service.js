/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 15:46:16
 * @modify date 2019-09-30 14:52:35
 * @desc [Message Service]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Message = require("./message.model");
const {
  messageDataFormat,
  complaintDataFormat
} = require("../../common/utils/data.format");
const isEmpty = require("lodash").isEmpty;
const {
  noDataFormat,
  showData,
  firebaseTopicPayload
} = require("../../common/utils/data.format");
const Firebase = require("../notification/firebase.service");
const { USER_ROLE } = require("../../common/constants");

class MessageService {
  static message({ user, from }, cb = (err, msg) => {}) {
    return Message.getMessage({ user, from }, (err, result) => {
      let _msg;
      if (err) return cb(err);

      if (isEmpty(result.message)) return cb(null, noDataFormat());

      if (from == "complaint") {
        _msg = complaintDataFormat(result.message);
        return cb(null, showData(_msg, "complaints"));
      }

      _msg = messageDataFormat(result.message);
      return cb(null, showData(_msg, "messages"));
    });
  }

  static send({ to, type, user, message }, cb = (err, result) => {}) {
    return Message.sendMessage(
      { to, type, user, messageData: message },
      (err, result) => {
        if (err) return cb(err);
        let topic = to === "teacher" ? "teachers" : to;
        let title = result.type.title;
        let body = result.type.msg;
        let data = {};
        data.type = result.type.type;
        if (topic === "teachers") {
          data.name = message.teacherName;
        }
        data.level = user.level;
        let payload = firebaseTopicPayload({ title, body, data });
        Firebase.sendTopicMessage({ topic, payload }, (err, res) => {
          if (err) {
            return console.error(err);
          }
          return console.log(res);
        });
        return cb(null, payload);
      }
    );
  }

  static deleteMessageById({ type, id }, cb = (err, res) => {}) {
    return Message.deleteMessage({ type, id }, (err, res) => {
      if (err) return cb(err);
      return cb(null, res);
    });
  }

  static sentMessage({ user }, cb = (err, msg) => {}) {
    const from = user.role == USER_ROLE.Parent ? "complaint" : "message";
    return Message.getSentMessage({ user, from }, (err, result) => {
      let _msg;
      if (err) return cb(err);

      if (isEmpty(result.message)) return cb(null, noDataFormat());

      if (from == "complaint") {
        _msg = complaintDataFormat(result.message);
        return cb(null, showData(_msg, "complaints"));
      }

      _msg = messageDataFormat(result.message);
      return cb(null, showData(_msg, "messages"));
    });
  }
}

module.exports = MessageService;
