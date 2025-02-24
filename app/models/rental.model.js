const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Rental = sequelize.define("Rental", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  car_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "cars", key: "id" },
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isAfterStartDate(value) {
        if (new Date(value) <= new Date(this.start_date)) {
          throw new Error("End date must be after start date.");
        }
      },
    },
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isFloat: { msg: "Total amount must be a valid number." },
      min: { args: [0.01], msg: "Total amount must be greater than 0." },
    },
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM("credit_card", "debit_card", "paypal", "bank_transfer"),
  },
  payment_status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
  },
  extra: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true, // This ensures that Sequelize adds created_at and updated_at automatically
  createdAt: 'created_at',  // Map the Sequelize default 'createdAt' to 'created_at'
  updatedAt: 'updated_at',  // Map the Sequelize default 'updatedAt' to 'updated_at'
});

module.exports = Rental;
