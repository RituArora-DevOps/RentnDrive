const { DataTypes, Sequelize } = require("sequelize");
const db = require("./db");

const Rental = db.define(
  "Rental",
  {
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
    created_at: {
      type: DataTypes.DATE,
      validate: {
        isBeforeStartDate(value) {
          if (value.toISOString().split('T')[0] >= this.start_date) { // 直接比较字符串
            throw new Error("Created_at must be before start date.");
          }
        }
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      validate: {
        isBeforeEndDate(value) {
          if (value.toISOString().split('T')[0] >= this.end_date) {
            throw new Error("Updated_at must be before end date.");
          }
        }
      }
    }

  },
  {
    tableName: "Rentals",
  }
);


module.exports = Rental;
