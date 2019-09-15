/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 15:46:16
 * @modify date 2019-09-11 15:46:16
 * @desc [Message Service]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const Message = require("./message.model");
const { messageDataFormat } = require("../../common/utils/data.format");
const isEmpty = require("lodash").isEmpty;
const {
  noDataFormat,
  showData,
  firebaseTopicPayload
} = require("../../common/utils/data.format");
const Firebase = require("../notification/firebase.service");

class MessageService {
  static message(type, cb = (err, msg) => {}) {
    return Message.getMessage(type, (err, msg) => {
      if (err) {
        return cb(err);
      }

      if (isEmpty(msg)) {
        return cb(null, noDataFormat());
      }

      let _msg = messageDataFormat(msg);
      return cb(null, showData(_msg, "messages"));
    });
  }
  static send({ to, type, user, message }, cb = (err, result) => {}) {
    return Message.sendMessage(
      { to: to, type: type, user: user, messageData: message },
      (err, result) => {
        if (err) return cb(err);
        let _message = firebaseTopicPayload(
          `${result.type.title} from ${result.type.from}`, //title
          result.type.msg, //message
          result.type.from //topic
        );
        Firebase.sendTopicMessage(_message, (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
        });
        return cb(null, result);
      }
    );
  }
}

module.exports = MessageService;
