const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config.js");
const log = require("npmlog");
require("dotenv").config(); // Load environment variables from .env file

/**
 * Database connection module using Sequelize.
 * @module Database
 */

/**
 * Sets the logging level for npmlog. Defaults to 'info' if not set in .env.
 */
log.level = process.env.LOG_LEVEL || "info";

/**
 * Ensures 'debug' level logging is available in npmlog.
 */
log.addLevel("debug", 1500, { fg: "blue", bold: true });

/**
 * Logs the current logging level for confirmation.
 */
log.info("Logging Level", `Current logging level: ${log.level}`);

/**
 * Sequelize instance for connecting to the MySQL database.
 * Configures the database connection using credentials from `dbConfig`.
 * @constant {Sequelize}
 */
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: (msg) => log.debug("SQL Query", msg), // Logs SQL queries only at DEBUG level
});

/**
 * Establishes a connection to the database and verifies authentication.
 * Logs success or failure messages.
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the database connection is successful.
 */
async function connectDB() {
  try {
    await sequelize.authenticate();
    log.info("Database Connection", "Successfully connected to the database.");
  } catch (error) {
    log.error("Database Connection", `Unable to connect to the database: ${error.message}`);
  }
}

// Connect to the database
connectDB();

/**
 * Exports the Sequelize instance for use in other modules.
 * @type {Sequelize}
 */
module.exports = sequelize;
