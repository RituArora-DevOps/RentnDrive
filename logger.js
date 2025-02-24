const log = require("npmlog");

log.level = process.env.LOG_LEVEL || "info"; // Default to "info" if LOG_LEVEL is not set

log.heading = "rentndrive"; // Custom heading for log entries
log.addLevel("trace", 1000, { fg: "blue", bold: true }); // Adding a custom log level (optional)

log.addLevel("notice", 2000, { fg: "green", bold: true }); // Custom log level 'notice'

// Export the log instance so other files can use it
module.exports = log;
