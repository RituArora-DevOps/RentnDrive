const sequelize = require("../models/db");
const Car = require("../models/car.model");
const Rental = require("../models/rental.model");
const User = require("../models/user.model");
const log = require("../../logger");
const { Op } = require("sequelize");

/**
 * Admin controller module for managing cars, orders, and customers.
 * @module AdminController
 */

/**
 * Retrieves all cars with sorting support.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllCars = async (req, res) => {
  try {
    let { sortBy = "id", order = "ASC" } = req.query;

    // Allowed sorting fields
    const allowedFields = ["id", "make", "model", "year", "price_per_day", "status", "type"];
    if (!allowedFields.includes(sortBy)) {
      log.warn(`Invalid sorting field: ${sortBy}`);
      return res.status(400).json({ message: "Invalid sorting field. Allowed: id, make, model, year, price_per_day, status, type." });
    }

    // Allowed sorting order
    order = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const cars = await Car.findAll({
      order: [[sortBy, order]],
    });

    log.info(`Admin retrieved car list sorted by ${sortBy} (${order}).`);
    res.status(200).json(cars);
  } catch (error) {
    log.error(`Error retrieving car list: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch car list." });
  }
};

/**
 * Adds a new car to the system.
 * @async
 * @function
 * @param {Object} req - Express request object containing car details.
 * @param {Object} res - Express response object.
 */
exports.addCar = async (req, res) => {
  try {
    const { make, model, year, price_per_day, status, type } = req.body;
    const currentYear = new Date().getFullYear();

    // Validate required fields
    if (!make || !model || !year || !price_per_day || !status || !type) {
      log.warn("Car addition failed: Missing required fields.");
      return res.status(400).json({ message: "All fields are required: make, model, year, price_per_day, status, type." });
    }

    // Validate data types
    if (typeof make !== "string" || typeof model !== "string" || typeof type !== "string") {
      log.warn("Car addition failed: Make, model, and type must be valid strings.");
      return res.status(400).json({ message: "Make, model, and type must be valid strings." });
    }

    if (!/^\d{4}$/.test(year) || year < 1900 || year > currentYear) {
      log.warn("Car addition failed: Invalid year.");
      return res.status(400).json({ message: `Year must be a valid four-digit number between 1900 and ${currentYear}.` });
    }

    if (isNaN(price_per_day) || price_per_day <= 0) {
      log.warn("Car addition failed: Invalid price_per_day.");
      return res.status(400).json({ message: "Price per day must be a positive number." });
    }

    const allowedStatuses = ["available", "booked", "maintenance"];
    if (!allowedStatuses.includes(status)) {
      log.warn("Car addition failed: Invalid status.");
      return res.status(400).json({ message: "Status must be one of: available, booked, maintenance." });
    }

    // Create a new car
    const newCar = await Car.create({ make, model, year, price_per_day, status, type });
    log.info(`Admin added a new car: ${newCar.id} - ${make} ${model}`);
    res.status(201).json({ message: "Car added successfully.", car: newCar });
  } catch (error) {
    log.error(`Error adding car: ${error.message}`);
    res.status(500).json({ message: "Failed to add car." });
  }
};

/**
 * Updates an existing car's information.
 * @async
 * @function
 * @param {Object} req - Express request object containing updated car details.
 * @param {Object} res - Express response object.
 */
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, price_per_day, status, type } = req.body;
    const currentYear = new Date().getFullYear();

    const car = await Car.findByPk(id);
    if (!car) {
      log.warn(`Car update failed: Car ID ${id} not found.`);
      return res.status(404).json({ message: "Car not found." });
    }

    // Ensure ID cannot be modified
    delete req.body.id;

    // Data validation
    if (year && (!/^\d{4}$/.test(year) || year < 1900 || year > currentYear)) {
      log.warn("Car update failed: Invalid year.");
      return res.status(400).json({ message: `Year must be a valid four-digit number between 1900 and ${currentYear}.` });
    }

    if (price_per_day && (isNaN(price_per_day) || price_per_day <= 0)) {
      log.warn("Car update failed: Invalid price_per_day.");
      return res.status(400).json({ message: "Price per day must be a positive number." });
    }

    if (status && !["available", "booked", "maintenance"].includes(status)) {
      log.warn("Car update failed: Invalid status.");
      return res.status(400).json({ message: "Status must be one of: available, booked, maintenance." });
    }

    await car.update({ make, model, year, price_per_day, status, type });
    log.info(`Admin updated car ID ${id}`);
    res.status(200).json({ message: "Car updated successfully.", car });
  } catch (error) {
    log.error(`Error updating car: ${error.message}`);
    res.status(500).json({ message: "Failed to update car." });
  }
};

/**
 * Deletes a car by ID.
 * @async
 * @function
 * @param {Object} req - Express request object containing the car ID to delete.
 * @param {Object} res - Express response object.
 */
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    log.info(`Admin requested to delete car ID ${id}`);

    const car = await Car.findByPk(id);
    if (!car) {
      log.warn(`Car deletion failed: Car ID ${id} not found.`);
      return res.status(404).json({ message: "Car not found." });
    }

    log.debug(`Found car: ${JSON.stringify(car)}`);

    const carCount = await Car.count();
    if (carCount <= 1) {
      log.warn("Car deletion failed: Cannot delete the last remaining car.");
      return res.status(400).json({ message: "Cannot delete the last remaining car." });
    }

    log.info(`Deleting related rentals for car ID ${id}`);
    await Rental.destroy({ where: { car_id: id } });

    log.info(`Deleting car ID ${id}`);
    await car.destroy({ force: true });

    log.info(`Car ID ${id} deleted successfully.`);
    res.status(200).json({ message: "Car deleted successfully." });
  } catch (error) {
    log.error(`Error deleting car: ${error.message}`);
    res.status(500).json({ message: "Failed to delete car." });
  }
};



/**
 * Retrieves all orders with sorting support.
 * @async
 * @function
 * @param {Object} req - Express request object containing query parameters.
 * @param {Object} res - Express response object.
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { sortBy = "id", order = "ASC" } = req.query;
    const validSortFields = ["id", "user_id", "car_id", "start_date", "end_date", "total_amount", "status", "payment_status", "created_at", "updated_at"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sort field." });
    }

    const rentals = await Rental.findAll({
      order: [[sortBy, order.toUpperCase()]],
    });

    res.json(rentals);
  } catch (error) {
    log.error(`Error fetching orders: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Deletes an order (booking) by ID.
 * @async
 * @function
 * @param {Object} req - Express request object containing order ID.
 * @param {Object} res - Express response object.
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByPk(id);
    if (!rental) {
      return res.status(404).json({ error: "Order not found." });
    }

    const today = new Date();
    const startDate = new Date(rental.start_date);
    const endDate = new Date(rental.end_date);

    if (today >= startDate && today <= endDate) {
      return res.status(400).json({ error: "Order is in progress and cannot be cancelled." });
    }

    if (today > endDate) {
      return res.status(400).json({ error: "Order has been completed and cannot be cancelled." });
    }

    await rental.destroy();
    log.info(`Order ID ${id} deleted successfully.`);
    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
    log.error(`Error deleting booking: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
};


/**
 * Retrieves a summary of orders (bookings) within a specified period.
 * @async
 * @function
 * @param {Object} req - Express request object containing query parameters.
 * @param {Object} res - Express response object.
 */
exports.getOrderSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const today = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ error: "Invalid period. Use 'week', 'month', or 'year'." });
    }

    // 将 startDate 转换为 yyyy-mm-dd 格式
    const formattedStartDate = startDate.toISOString().slice(0, 10);

    const orders = await Rental.findAll({
      where: {
        created_at: {
          [Op.gte]: formattedStartDate,
        },
      },
      order: [["created_at", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    log.error(`Error generating summary: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
};


/**
 * Retrieves all customers with sorting support.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: { exclude: ["password_hash"] },
      order: [["id", "ASC"]],
    });

    res.json(customers);
  } catch (error) {
    log.error(`Error fetching customers: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Deletes a customer by ID.
 * @async
 * @function
 * @param {Object} req - Express request object containing customer ID.
 * @param {Object} res - Express response object.
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id, role: "customer" } });
    if (!user) {
      return res.status(404).json({ error: "Customer not found." });
    }

    await user.destroy();
    res.json({ message: `Customer ${id} has been deleted successfully.` });
  } catch (error) {
    log.error(`Error deleting customer: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Adds a new customer (for testing purposes only).
 * @async
 * @function
 * @param {Object} req - Express request object containing customer details.
 * @param {Object} res - Express response object.
 */
// Add a new customer（only for testing）
exports.addCustomer = async (req, res) => {
  try {
    const role = "admin";

    // Check if the current user is an admin; if not, return a 403 error
    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Extract user data from the request body
    const { username, password_hash, email, phone } = req.body;

    // Create a new customer user
    const newUser = await User.create({
      username,
      password_hash, // Assuming the password is already hashed
      role: "customer", // Set the role to 'customer'
      email,
      phone,
    });

    // Return the newly created user information
    res.status(201).json(newUser);
  } catch (err) {
    // Return a 400 status with an error message if something goes wrong
    res.status(400).json({ message: err.message });
  }
};


/**
 * Adds a new rental order (for testing purposes only).
 * @async
 * @function
 * @param {Object} req - Express request object containing rental details.
 * @param {Object} res - Express response object.
 */
// Add a new rental order (only for testing)
exports.addOrder = async (req, res) => {
  try {
    let {
      user_id,
      car_id,
      start_date,
      end_date,
      total_amount,
      status,
      payment_method,
      payment_status,
      amount,
      payment_date,
      extra,
      created_at,
      updated_at,
    } = req.body;

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);


    if (!created_at) {
      const createdAtObj = new Date(startDateObj);
      createdAtObj.setDate(createdAtObj.getDate() - 2);
      created_at = createdAtObj.toISOString().slice(0, 19).replace("T", " ");
    }


    if (!updated_at) {
      const updatedAtObj = new Date(endDateObj);
      updatedAtObj.setDate(updatedAtObj.getDate() - 1);
      updated_at = updatedAtObj.toISOString().slice(0, 19).replace("T", " ");
    }

    const newRental = await Rental.create({
      user_id,
      car_id,
      start_date,
      end_date,
      total_amount,
      status,
      payment_method,
      payment_status,
      amount,
      payment_date,
      extra,
      created_at,
      updated_at,
    });

    res.status(201).json(newRental);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

