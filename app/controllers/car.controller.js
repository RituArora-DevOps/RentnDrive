const Car = require("../models/car.model");
const Rental = require("../models/rental.model"); // Import the Rental model
const log = require("../../logger");
const { Op } = require("sequelize");

// Get all cars
// Get all cars with optional filtering and sorting via query parameters
/*exports.getAllCars = async (req, res) => {
    try {
      // Build a "where" clause object based on query parameters.
      const whereClause = {};
  
      // Filter by make if provided
      if (req.query.make) {
        whereClause.make = req.query.make;
      }
  
      // Filter by type if provided
      if (req.query.type) {
        whereClause.type = req.query.type;
      }
  
      // Filter by year if provided (assuming year is a number)
      if (req.query.year) {
        whereClause.year = req.query.year;
      }
  
      // (Optional) If you want to support price range filtering:
      if (req.query.minPrice || req.query.maxPrice) {
        whereClause.price_per_day = {};
        if (req.query.minPrice) {
          whereClause.price_per_day[Op.gte] = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice) {
          whereClause.price_per_day[Op.lte] = parseFloat(req.query.maxPrice);
        }
      }
  
      // (Optional) Sorting: if query parameters for sorting are provided (e.g., sortBy and order)
      let order = [];
      if (req.query.sortBy) {
        // Default order is ascending unless "desc" is specified
        const sortOrder = req.query.order && req.query.order.toUpperCase() === "DESC" ? "DESC" : "ASC";
        order.push([req.query.sortBy, sortOrder]);
      }
  
      const cars = await Car.findAll({
        where: whereClause,
        order: order.length ? order : undefined
      });
      res.json(cars);
    } catch (error) {
      log.error(`Error getting all cars: ${error.message}`);
      res.status(500).json({ message: "Internal server error." });
    }
  };*/

  const Car = require("../models/car.model");
  const Rental = require("../models/rental.model"); // Import the Rental model
  const log = require("../../logger");
  const { Op } = require("sequelize");
  
  exports.getAllCars = async (req, res) => {
    try {
      // Build a "where" clause object based on query parameters.
      const whereClause = {};
  
      // Filter by make if provided (case-insensitive partial match)
      if (req.query.make) {
        whereClause.make = { [Op.iLike]: `%${req.query.make}%` };
      }
  
      // Filter by type if provided (case-insensitive partial match)
      if (req.query.type) {
        whereClause.type = { [Op.iLike]: `%${req.query.type}%` };
      }
  
      // Filter by year if provided (exact match)
      if (req.query.year) {
        whereClause.year = parseInt(req.query.year, 10);
      }
  
      // Price range filtering
      if (req.query.minPrice || req.query.maxPrice) {
        whereClause.price_per_day = {};
        if (req.query.minPrice) {
          whereClause.price_per_day[Op.gte] = parseFloat(req.query.minPrice);
        }
        if (req.query.maxPrice) {
          whereClause.price_per_day[Op.lte] = parseFloat(req.query.maxPrice);
        }
      }
  
      // Sorting: using sortBy and order query parameters.
      let order = [];
      if (req.query.sortBy) {
        const sortOrder = req.query.order && req.query.order.toUpperCase() === "DESC" ? "DESC" : "ASC";
        order.push([req.query.sortBy, sortOrder]);
      }
  
      const cars = await Car.findAll({
        where: whereClause,
        order: order.length ? order : undefined
      });
  
      res.json(cars);
    } catch (error) {
      log.error(`Error getting all cars: ${error.message}`);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
  

// Get a car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }
        res.json(car);
    } catch (error) {
        log.error(`Error getting car by ID: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Add a new car (admin only)
exports.addCar = async (req, res) => {
    try {
        // Extract fields including image_url
        const { make, model, year, price_per_day, status, type, image_url } = req.body;

        // Input validation
        if (!make || !model || !year || !price_per_day || !status || !type) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate year and price_per_day types
        if (typeof year !== "number" || year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({ message: "Invalid year." });
        }

        if (typeof price_per_day !== "number" || price_per_day <= 0) {
            return res.status(400).json({ message: "Invalid price per day." });
        }

        if (!["available", "booked", "maintenance"].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        // Create a new car record including image_url (if provided)
        const newCar = await Car.create({
            make,
            model,
            year,
            price_per_day,
            status,
            type,
            image_url: image_url || null  // Set to null if not provided
        });

        res.status(201).json(newCar);
    } catch (error) {
        log.error(`Error adding car: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Update a car (admin only)
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }

        // Destructure updatable fields, including image_url if you want to update it.
        const { year, price_per_day, status, image_url } = req.body;

        // Validate year and price_per_day if provided
        if (year && (typeof year !== "number" || year < 1900 || year > new Date().getFullYear())) {
            return res.status(400).json({ message: "Invalid year." });
        }

        if (price_per_day && (typeof price_per_day !== "number" || price_per_day <= 0)) {
            return res.status(400).json({ message: "Invalid price per day." });
        }

        if (status && !["available", "booked", "maintenance"].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        await car.update({ year, price_per_day, status, image_url });
        res.json(car);
    } catch (error) {
        log.error(`Error updating car: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Delete a car (admin only)
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }
        await car.destroy();
        res.json({ message: "Car deleted successfully." });
    } catch (error) {
        log.error(`Error deleting car: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

/** 
// Get available cars for specific dates
exports.getAvailableCars = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start and end dates are required." });
        }

        const availableCars = await Car.findAll({
            where: {
                status: "available",
                id: {
                    [Op.notIn]: db.literal(`
                        SELECT car_id FROM booking_payments
                        WHERE (start_date <= '${endDate}' AND end_date >= '${startDate}')
                    `)
                }
            }
        });

        res.json(availableCars);
    } catch (error) {
        log.error(`Error getting available cars: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};
*/