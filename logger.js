const log = require("npmlog");

/**
 * Logger configuration module using npmlog.
 * This module sets up a customized logging system for the Car Rental System.
 * @module Logger
 */

/**
 * Sets the logging level from the environment variable `LOG_LEVEL`, defaulting to `"info"` if not provided.
 * @type {string}
 */
log.level = process.env.LOG_LEVEL || "info";

/**
 * Custom heading for log entries in the Car Rental System.
 * @type {string}
 */
log.heading = "CarRentalSystem";

/**
 * Adds a custom log level `trace` with a priority of 1000.
 * This log level is used for detailed debugging information.
 */
log.addLevel("trace", 1000, { fg: "blue", bold: true });

/**
 * Adds a custom log level `notice` with a priority of 2000.
 * This log level is used for general notices and important information.
 */
log.addLevel("notice", 2000, { fg: "green", bold: true });

/**
 * Exports the configured npmlog instance for use in other modules.
 * @type {npmlog}
 */
module.exports = log;
