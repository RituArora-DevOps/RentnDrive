const db = require("../models/db");
const Car = require("../models/car.model");
const Rental = require("../models/rental.model");
const User = require("../models/user.model");
const log = require("../../logger");
const { Op } = require("sequelize");

// Retrieve all cars (with sorting support)
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

// Add a new car (with validation)
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

// Update car information (ID cannot be modified, with validation)
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

// Delete a car (only by ID, at least one car must remain)
// Delete a car (only by ID, at least one car must remain)
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


// Retrieve all orders (with sorting support)
exports.getAllOrders = async (req, res) => {
  try {
    const { sortBy = "id", order = "ASC" } = req.query;
    const validSortFields = ["id", "user_id", "car_id", "start_date", "end_date", "total_amount", "status", "payment_status", "created_at"];
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

// Cancel a booking (only by ID)
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findByPk(id);
    if (!rental) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (rental.status === "cancelled") {
      return res.status(400).json({ error: "Order is already cancelled." });
    }

    rental.status = "cancelled";
    await rental.save();

    res.json({ message: `Order ${id} has been cancelled successfully.` });
  } catch (error) {
    log.error(`Error cancelling order: ${error.message}`);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get booking summary
exports.getOrderSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const today = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case "month":
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        break;
      default:
        return res.status(400).json({ error: "Invalid period. Use 'week', 'month', or 'year'." });
    }

    const orders = await Rental.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate,
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

// Retrieve all customers (with sorting support)
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

// Delete a customer (only by ID)
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

/* created by Haitao, commented by me

// Add a new rental order (only for testing)
exports.addOrder = async (req, res) => {
  try {

    // Extract order data from the request body
    const { user_id, car_id, start_date, end_date, total_amount, status, payment_method, payment_status, amount, payment_date, extra } = req.body;

    // Validate that the start date is before the end date
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ message: "End date must be after the start date." });
    }

    // Create a new rental order
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
    });

    // Return the newly created rental order information
    res.status(201).json(newRental);
  } catch (err) {
    // Return a 400 status with an error message if something goes wrong
    res.status(400).json({ message: err.message });
  }
};

*/