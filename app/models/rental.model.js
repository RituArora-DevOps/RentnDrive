
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

    /**
     * The total amount for the rental.
     * @type {number}
     */
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    /**
     * The rental status.
     * @type {"pending" | "confirmed" | "cancelled" | "completed"}
     */
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      allowNull: false,
    },

    /**
     * The payment method used.
     * @type {"credit_card" | "debit_card" | "paypal" | "bank_transfer"}
     */
    payment_method: {
      type: DataTypes.ENUM("credit_card", "debit_card", "paypal", "bank_transfer"),
    },

    /**
     * The payment status.
     * @type {"pending" | "completed" | "failed"}
     */
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
    },

    /**
     * The amount paid.
     * @type {number}
     */
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    /**
     * The payment date.
     * @type {Date}
     */
    payment_date: {
      type: DataTypes.DATE,
    },

    /**
     * Additional information or notes about the rental.
     * @type {string}
     */
    extra: {
      type: DataTypes.TEXT,
    },

    /**
     * The timestamp when the rental record was created.
     * Must be before the `start_date`.
     * @type {Date}
     */
    created_at: {
      type: DataTypes.DATE,
      validate: {
        /**
         * Validates that `created_at` is before `start_date`.
         * @param {Date} value - The creation timestamp.
         * @throws {Error} If `created_at` is not before `start_date`.
         */
        isBeforeStartDate(value) {
          if (value.toISOString().split("T")[0] >= this.start_date) {
            throw new Error("Created_at must be before start date.");
          }
        },
      },
    },

    /**
     * The timestamp when the rental record was last updated.
     * Must be before the `end_date`.
     * @type {Date}
     */
    updated_at: {
      type: DataTypes.DATE,
      validate: {
        /**
         * Validates that `updated_at` is before `end_date`.
         * @param {Date} value - The update timestamp.
         * @throws {Error} If `updated_at` is not before `end_date`.
         */
        isBeforeEndDate(value) {
          if (value.toISOString().split("T")[0] >= this.end_date) {
            throw new Error("Updated_at must be before end date.");
          }
        },
      },
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
