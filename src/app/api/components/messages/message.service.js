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
  complaintDataFormat,
} = require("../../common/utils/data.format");
const {
  showData,
  firebaseTopicPayload,
} = require("../../common/utils/data.format");
const Firebase = require("../notification/firebase.service");
const { USER_ROLE } = require("../../common/constants");

class MessageService {
  static messageAsync({ user, from }) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Message.getMessage({ user, from });

        if (from == "complaint") {
          const msg = complaintDataFormat(data);
          return resolve(showData(msg, "complaints"));
        }

        const msg = messageDataFormat(data);
        return resolve(showData(msg, "messages"));
      } catch (err) {
        reject(err);
      }
    });
  }

  static sendMessageAsync({ recipient, user, message }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Message.saveSendMessageAsync({
          recipient,
          user,
          messageData: message,
        });

        const { title, msg } = result;

        const topic = recipient === "teacher" ? "teachers" : recipient;
        const body = msg;
        const data = {};
        data.type = result.type;

        if (topic === "teachers") {
          data.name = message.teacherName;
        }

        if (result.target_name !== "") {
          data.name = result.target_name;
        }

        data.level = user.level;
        const payload = firebaseTopicPayload({ title, body, data });
        const _ = await Firebase.sendTopicMessageAsync({ topic, payload });
        console.log(`firebase response`,_);
        resolve(payload);
      } catch (err) {
        reject(err);
      }
    });
  }

  static deleteMessageByIdAsync({ type, id }) {
    return Message.deleteMessageAsync({ type, id });
  }

  static sentMessageAsync({ user }) {
    return new Promise(async (resolve, reject) => {
      try {
        const from = user.role === USER_ROLE.Parent ? "complaint" : "message";
        const data = await Message.getSentMessageAsync({ user, from });

        if (from === "complaint") {
          const msg = complaintDataFormat(data);
          return resolve(showData(msg, "complaints"));
        }

        const msg = messageDataFormat(data);
        return resolve(showData(msg, "messages"));
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = MessageService;
