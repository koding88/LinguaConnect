const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const path = require("path");

// Format log messages
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    level: "info",
    format: combine(
        timestamp({
            format: "DD-MM-YYYY HH:mm:ss",
        }),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(__dirname, "../logs/app.log"),
        }),
    ],
});

module.exports = logger;
