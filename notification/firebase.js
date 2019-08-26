const firebase = require("firebase-admin");

module.exports = {
  //
  // ─── FIREBASE TOPIC MESSAGE ─────────────────────────────────────────────────────
  //

  sendTopicMessage: message => {
    return firebase.messaging().send(message);
  }
};
