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
const { noDataFormat, showData } = require("../../common/utils/data.format");

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
}

module.exports = MessageService;
