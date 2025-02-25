const log = require("npmlog");
const fs = require("fs");
const path = require("path");


log.level = process.env.LOG_LEVEL || "info";
log.heading = "CarRentalSystem";
log.addLevel("trace", 1000, { fg: "blue", bold: true });
log.addLevel("notice", 2000, { fg: "green", bold: true });

const logFilePath = path.join(__dirname, "./app/logs/app.log"); 

const originalLog = log.log;

log.log = function (level, prefix, message, ...args) {
    originalLog.call(this, level, prefix, message, ...args);

    const logMessage = `${new Date().toISOString()} - ${level.toUpperCase()} - ${prefix} - ${message} ${args.join(" ")}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
};

module.exports = log;

