const Car = require("../models/car.model");
const Rental = require("../models/rental.model"); // Import the Rental model
const log = require("../../logger");
const { Op } = require("sequelize");

// Get all cars
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.findAll();
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
        const { make, model, year, price_per_day, status, type } = req.body;

        // Input validation
        if (!make || !model || !year || !price_per_day || !status || !type) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (typeof year !== "number" || year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({ message: "Invalid year." });
        }

        if (typeof price_per_day !== "number" || price_per_day <= 0) {
            return res.status(400).json({ message: "Invalid price per day." });
        }

        if (!["available", "booked", "maintenance"].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const newCar = await Car.create(req.body);
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

        const { year, price_per_day, status } = req.body;

        // Input validation for updatable fields
        if (year && (typeof year !== "number" || year < 1900 || year > new Date().getFullYear())) {
            return res.status(400).json({ message: "Invalid year." });
        }

        if (price_per_day && (typeof price_per_day !== "number" || price_per_day <= 0)) {
            return res.status(400).json({ message: "Invalid price per day." });
        }

        if (status && !["available", "booked", "maintenance"].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        await car.update(req.body);
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