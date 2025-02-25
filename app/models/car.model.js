const { DataTypes } = require("sequelize");
const sequelize = require("./db");

/**
 * Car model definition for the database.
 * Represents a vehicle that can be rented.
 * @module CarModel
 */

/**
 * Sequelize model representing a Car.
 * @typedef {Object} Car
 * @property {number} id - The unique identifier for the car.
 * @property {string} make - The manufacturer of the car (e.g., Toyota, Ford).
 * @property {string} model - The specific model name (e.g., Camry, Mustang).
 * @property {number} year - The manufacturing year of the car.
 * @property {number} price_per_day - The rental price per day in USD.
 * @property {"available" | "booked" | "maintenance"} status - The current status of the car.
 * @property {string} type - The category/type of the car (e.g., sedan, SUV).
 */

const Car = sequelize.define("Car", {
  /**
   * The unique identifier for the car.
   * @type {number}
   */
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  /**
   * The manufacturer of the car (e.g., Toyota, Ford).
   * @type {string}
   */
  make: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Make is required." },
      is: {
        args: /^[A-Za-z0-9\s\-]+$/,
        msg: "Make must be a valid string containing letters, numbers, or dashes.",
      },
    },
  },

  /**
   * The specific model name (e.g., Camry, Mustang).
   * @type {string}
   */
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Model is required." },
      is: {
        args: /^[A-Za-z0-9\s\-]+$/,
        msg: "Model must be a valid string containing letters, numbers, or dashes.",
      },
    },
  },

  /**
   * The year the car was manufactured.
   * @type {number}
   */
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: 1900, msg: "Year must be at least 1900." },
      max: { args: new Date().getFullYear(), msg: `Year cannot exceed ${new Date().getFullYear()}.` },
      isInt: { msg: "Year must be an integer." },
    },
  },

  /**
   * The rental price per day in USD.
   * @type {number}
   */
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isFloat: { msg: "Price per day must be a valid number." },
      min: { args: 0.01, msg: "Price per day must be greater than 0." },
    },
  },

  /**
   * The current status of the car.
   * @type {"available" | "booked" | "maintenance"}
   */
  status: {
    type: DataTypes.ENUM("available", "booked", "maintenance"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["available", "booked", "maintenance"]],
        msg: "Status must be one of: available, booked, maintenance.",
      },
    },
  },

  /**
   * The category/type of the car (e.g., sedan, SUV).
   * @type {string}
   */
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Type is required." },
      is: {
        args: /^[A-Za-z0-9\s\-]+$/,
        msg: "Type must be a valid string containing letters, numbers, or dashes.",
      },
    },
  },
}, {
  timestamps: false,
});

module.exports = Car;
