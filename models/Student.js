const Database = require("../config/Database");
const { dbConfig } = require("../config/config");
const db = new Database(dbConfig);
const _ = require("lodash");
const { noDataFormat, showData } = require("../utils/formatResource");

module.exports = {
  //#region student message
  studentMessage: (req, res, level) => {
    const sql = `SELECT 
        id, Message_BY, M_Date, Message, Message_Level, M_Read
        FROM message WHERE id = ? ORDER BY M_Date DESC `;
    db.query(sql, [level])
      .then(data => {
        if (_.isEmpty(data)) {
          res.status(404).send(noDataFormat());
          return;
        }
        res.send(showData(data));
      })
      .catch(err => console.error(err));
  }
  //#endregion
};
