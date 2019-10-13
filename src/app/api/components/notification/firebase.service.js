/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-12 11:31:12
 * @modify date 2019-09-12 11:31:12
 * @desc [firebase service]
 */
//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const firebase = require("firebase-admin");
const Firebase = {};

//
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E N D   T O P I C   M E S S A G E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
//

Firebase.sendTopicMessage = ({ topic, payload }, done = (err, rs) => {}) => {
  return firebase
    .messaging()
    .sendToTopic(topic, payload)
    .then(resp => {
      return done(null, resp);
    })
    .catch(err => {
      return done(err);
    });
};
module.exports = Firebase;
