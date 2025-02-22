require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST || "fsd25rha.mysql.database.azure.com",
  USER: process.env.DB_USER || "dbadmin",
  PASSWORD: process.env.DB_PASSWORD || "UFmqgheOMHXP6Miu",
  DB: process.env.DB_NAME || "fsd25rha",
  dialect: process.env.DB_DIALECT || "mysql",

  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },

  ssl: process.env.DB_SSL === "true",
};
