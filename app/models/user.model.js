const { DataTypes } = require("sequelize");
const sequelize = require("./db");


/**
 * User model definition for the database.
 * Represents users who can interact with the system.
 * @module UserModel
 */

/**
 * Sequelize model representing a User.
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user.
 * @property {string} username - The unique username of the user.
 * @property {string} password_hash - The hashed password of the user.
 * @property {"admin" | "customer"} role - The role of the user in the system.
 * @property {string} email - The email address of the user.
 * @property {string} [phone] - The phone number of the user.
 * @property {Date} created_at - The timestamp when the user account was created.
 * @property {Date} updated_at - The timestamp when the user account was last updated.
 */

const User = db.define("User", {
  /**
   * The unique identifier for the user.
   * @type {number}
   */

const User = sequelize.define("User", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  /**
   * The unique username of the user.
   * @type {string}
   */
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  /**
   * The hashed password of the user.
   * @type {string}
   */
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  /**
   * The role of the user in the system.
   * @type {"admin" | "customer"}
   */
  role: {
    type: DataTypes.ENUM("admin", "customer"),
    allowNull: false,
    defaultValue: "customer",
  },

  /**
   * The email address of the user.
   * @type {string}
   * @throws {Error} If the email format is invalid.
   */
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: "Invalid email format." },
    },
  },

  /**
   * The phone number of the user (optional).
   * @type {string}
   */
  phone: {
    type: DataTypes.STRING,
  },
}, {
  /**
   * Automatically adds `created_at` and `updated_at` timestamps.
   */
  timestamps: true,

  /**
   * Maps `createdAt` and `updatedAt` to custom column names.
   * @property {string} createdAt - The timestamp when the user was created.
   * @property {string} updatedAt - The timestamp when the user was last updated.
   */
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
