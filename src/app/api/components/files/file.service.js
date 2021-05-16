/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-09-11 16:32:38
 * @modify date 2019-09-14 23:33:43
 * @desc [File Service]
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//
const { USER_ROLE } = require("../../common/constants");
const {
  getFileTable,
  prepareToUploadFile,
  fileFormatType,
  findAndDeleteAsync,
  preprareToUploadVideoAsync,
} = require("./file.util");
const FileModel = require("./file.model.js");
const {
  showData,
  billDataFormat,
  circularFormat,
  fileDataFormat,
  uploadedDataFormat,
} = require("../../common/utils/data.format");
const FirebaseService = require("../notification/firebase.service");
const { FIREBASE_TOPIC } = require("../../common/constants");
const { firebaseTopicPayload } = require("../../common/utils/data.format");

class FileService {
  //
  // ─── GET SPECIFIED FILES ────────────────────────────────────────────────────────
  //

  static getFileTypeAsync(user, { type, format, paging }) {
    let fetchFrom = user.role === USER_ROLE.Parent ? user.level : user.username;
    let column =
      user.role === USER_ROLE.Parent ? "Students_No" : "Teachers_Email";
    const fileTable = getFileTable(type, format);
    if (type === "report") {
      fetchFrom = user.ref;
    }

    if (type === "report" && user.role === USER_ROLE.Teacher) {
      fetchFrom = user.username;
    }

    if (type === "circular") {
      fetchFrom = user.faculty;
    }

    if (type === "bill") {
      fetchFrom = user.ref;
    }
    
    if (type === "receipt") {
      fetchFrom = user.ref;
    }

    return FileModel.getFileAsync({
      from: fetchFrom,
      fileTable: fileTable,
      column,
      paging,
    });
  }

  //
  // ─── UPLOAD FILE ────────────────────────────────────────────────────────────────
  //

  static uploadFileTypeAsync(user, { type, file, reportInfo }) {
    return new Promise(async (resolve, reject) => {
      try {
        let format = fileFormatType(file.mimetype);
        let fileTable = getFileTable(type, format);

        const uploadInfo = await prepareToUploadFile({ fileTable, file });
        const result = await FileModel.saveFilePathAsync(
          user,
          uploadInfo,
          reportInfo
        );

        if (!result) return reject(false);
        if (result.notify) {
          const { topic, payload } = result;
          await FirebaseService.sendTopicMessageAsync({
            topic,
            payload,
          });
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  //
  // ─── DELETE FILE ────────────────────────────────────────────────────────────────
  //

  static deleteTypeAsync(user, { id, path, type, format }) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileTable = getFileTable(type, format);
        const result = await FileModel.deleteFilePathAsync(id, {
          user,
          fileTable,
        });
        await findAndDeleteAsync(path);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  //#region  UPLOAD VIDEO FILE
  static uploadVideoAsync({ user, recipient, file, info }) {
    return new Promise(async (resolve, reject) => {
      try {
        const _data = await preprareToUploadVideoAsync({ info, file });
        const result = await FileModel.saveVideoFilePathAsync({
          user,
          recipient,
          data: _data,
        });

        const { title, body, data } = result.notification;
        const topic = FIREBASE_TOPIC.Parent;
        const payload = firebaseTopicPayload({ title, body, data });
        const fcm = await FirebaseService.sendTopicMessageAsync({
          topic,
          payload,
        });

        resolve(fcm);
      } catch (error) {
        reject(error);
      }
    });
  }
  //#endregion

  static getVideosAsync({ user }) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await FileModel.getSavedVideosPathAsync({ user });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = FileService;
