require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "CarRentalSystem",
  PASSWORD: process.env.DB_PASSWORD || "m09^aa63zRXR",
  DB: process.env.DB_NAME || "CarRentalSystem",
  dialect: process.env.DB_DIALECT || "mysql",

  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },

  ssl: process.env.DB_SSL === "true",
};
