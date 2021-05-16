const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
let logDirectory = path.join(__dirname, "../../../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      level: "info",
      filename: `${logDirectory}/info.log`
    }),
    new winston.transports.File({
      filename: `${logDirectory}/combine.log`
    })
  ],
  exitOnError: true
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
      handleExceptions: true
    })
  );
} else {
  logger.configure({
    level: "verbose",
    transports: [
      new DailyRotateFile({
        filename: `${logDirectory}/app.log-%DATE%.log`,
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d"
      })
    ]
  });
}

module.exports = logger;
