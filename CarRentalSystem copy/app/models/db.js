const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config.js");
const log = require("npmlog");
require("dotenv").config(); // Load environment variables from .env file

// Set npmlog logging level (default to 'info' if not set in .env)
log.level = process.env.LOG_LEVEL || "info";

// Ensure 'debug' level is available for npmlog
log.addLevel('debug', 1500, { fg: 'blue', bold: true });

// Log the current logging level to confirm it's set correctly
log.info("Logging Level", `Current logging level: ${log.level}`);

// Create a new Sequelize instance to connect to the MySQL database
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {}, // Enable SSL for Azure
  logging: (msg) => log.debug("SQL Query", msg), // Log SQL queries only in DEBUG level
});

// Function to test and establish a connection to the database
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

module.exports = sequelize;
