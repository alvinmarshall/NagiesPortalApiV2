/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:37:03
 * @modify date 2019-09-11 12:54:16
 * @desc app constants
 */

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

module.exports.TABLE_USER = "users";
module.exports.TABLE_STUDENT = "student";
module.exports.TABLE_TEACHER = "teachers";
module.exports.USER_ROLE = { Parent: "parent", Teacher: "teacher" };
module.exports.FORMAT_TYPE = { PDF: "pdf", IMAGE: "image", Other: "other" };
module.exports.TABLE_ASSIGNMENT_PDF = "assignment";
module.exports.TABLE_ASSIGNMENT_IMAGE = "assignment_image";
module.exports.TABLE_REPORT_PDF = "report";
module.exports.TABLE_REPORT_IMAGE = "report_png";
module.exports.TABLE_ANNOUNCEMENT = "message";
module.exports.TABLE_CIRCULAR = "circular";
module.exports.TABLE_MESSAGE = "message";
module.exports.TABLE_BILLING = "billing";
module.exports.TABLE_COMPLAINTS = "complaints";
module.exports.DIRECTORY = {
  studentsUpload: "students/assignment",
  teachersUpload: "teacher/uploads"
};
module.exports.FIREBASE_TOPIC = {
  Parent: "parent",
  Teacher: "teacher",
  Global: "global"
};

module.exports.DATE_TYPE = {fullDate:"ddd, mmmm dd yyyy",shortDate:"ddd, mmmm dd yyyy",simpleDate:"mmmm d, yyyy"}
