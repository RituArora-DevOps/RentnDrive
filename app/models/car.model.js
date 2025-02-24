const { DataTypes } = require("sequelize");
const db = require("./db");

const Car = db.define("Car", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
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
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: 1900, msg: "Year must be at least 1900." },
      max: { args: new Date().getFullYear(), msg: `Year cannot exceed ${new Date().getFullYear()}.` },
      isInt: { msg: "Year must be an integer." },
    },
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isFloat: { msg: "Price per day must be a valid number." },
      min: { args: 0.01, msg: "Price per day must be greater than 0." },
    },
  },
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
