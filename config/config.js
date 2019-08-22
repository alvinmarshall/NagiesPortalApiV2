if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

module.exports = {
  dbConfig: {
    host: process.env.HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USR,
    password: process.env.DB_PWD
  }
};
