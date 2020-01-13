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
module.exports.TABLE_TIME_TABLE = "timetable";

module.exports.DIRECTORY = {
  assignmentUpload: "students/assignment",
  reportUpload: "students/Reports",
  timetableUpload: "students/Timetable",
  circularUpload: "students/Circular",
  billUpload: "students/Bill",
  teachersUpload: "teacher/uploads"
};
module.exports.FIREBASE_TOPIC = {
  Parent: "parent",
  Teacher: "teacher",
  Global: "global"
};

module.exports.DATE_TYPE = {
  fullDate: "ddd, mmmm dd yyyy",
  shortDate: "ddd, mmmm dd yyyy",
  simpleDate: "mmmm d, yyyy",
  inDepthDate: "ddd, mmmm dd yyyy h:MM tt"
};
module.exports.FILE_TYPE = {
  Assignment: {
    name: "assignment",
    pdf: {
      table: this.TABLE_ASSIGNMENT_PDF,
      format: "pdf",
      location: this.DIRECTORY.assignmentUpload
    },
    image: {
      table: this.TABLE_ASSIGNMENT_IMAGE,
      format: "image",
      location: this.DIRECTORY.assignmentUpload
    }
  },
  Report: {
    name: "report",
    pdf: {
      table: this.TABLE_REPORT_PDF,
      format: "pdf",
      location: this.DIRECTORY.reportUpload
    },
    image: {
      table: this.TABLE_REPORT_IMAGE,
      format: "image",
      location: this.DIRECTORY.reportUpload
    }
  },
  Circular: {
    name: "circular",
    pdf: {
      table: this.TABLE_CIRCULAR,
      format: "pdf",
      location: this.DIRECTORY.circularUpload
    },
    image: {
      table: this.TABLE_CIRCULAR,
      format: "image",
      location: this.DIRECTORY.circularUpload
    }
  },
  Bills: {
    name: "bill",
    pdf: {
      table: this.TABLE_BILLING,
      format: "pdf",
      location: this.DIRECTORY.billUpload
    },
    image: {
      table: this.TABLE_BILLING,
      format: "image",
      location: this.DIRECTORY.billUpload
    }
  },
  TimeTable: {
    name: "timetable",
    pdf: {
      table: this.TABLE_TIME_TABLE,
      format: "pdf",
      location: this.DIRECTORY.timetableUpload
    },
    image: {
      table: this.TABLE_TIME_TABLE,
      format: "image",
      location: this.DIRECTORY.timetableUpload
    }
  }
};

module.exports.MESSAGE_TYPE = {
  Message: {
    name: "message",
    table: this.TABLE_MESSAGE,
    info: ""
  },
  Complaint: {
    name: "complaint",
    table: this.TABLE_COMPLAINTS,
    info: this.TABLE_STUDENT
  }
};

module.exports.getCommonDateStyle = () => {
  return new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};
