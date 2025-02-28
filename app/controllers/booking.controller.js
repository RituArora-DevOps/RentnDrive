// const db = require("../models/db");
const sequelize = require("../models/db"); 
const Car = require("../models/car.model");
const Rental = require("../models/rental.model");
const log = require("../../logger");
const { Op } = require("sequelize");
// const { sequelize } = require("../models/db"); // Import sequelize instance

// Check car availability

exports.getAvailableCars = async (req, res) => {
    try {
      const { startDate, endDate, make, type, year, minPrice, maxPrice } = req.query;
  
      // Validate the presence and format of dates
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and end dates are required." });
      }
      if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        return res.status(400).json({ message: "Invalid date format." });
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return res.status(400).json({ message: "End date must be after start date." });
      }
  
      // Build additional filters for the Car model
      let carWhere = { status: "available" };
      if (make) {
        carWhere.make = { [Op.like]: `%${make}%` };
      }
      if (type) {
        carWhere.type = { [Op.like]: `%${type}%` };
      }
      if (year) {
        carWhere.year = parseInt(year, 10);
      }
      if (minPrice || maxPrice) {
        carWhere.price_per_day = {};
        if (minPrice) {
          carWhere.price_per_day[Op.gte] = parseFloat(minPrice);
        }
        if (maxPrice) {
          carWhere.price_per_day[Op.lte] = parseFloat(maxPrice);
        }
      }
  
      // Get the list of car IDs already booked in the given date range
      const rentedCars = await Rental.findAll({
        attributes: ['car_id'],
        where: {
          start_date: { [Op.lte]: end },
          end_date: { [Op.gte]: start }
        }
      });
      const rentedCarIds = rentedCars.map(rental => rental.car_id);
  
      // Find cars that match the extra filters and are NOT booked
      const availableCars = await Car.findAll({
        where: {
          ...carWhere,
          id: { [Op.notIn]: rentedCarIds }
        }
      });
  
      res.json(availableCars);
    } catch (error) {
      log.error(`Error getting available cars: ${error.message}`);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  



// Create a new booking
exports.createBooking = async (req, res) => {
    console.log(sequelize); 
    const transaction = await sequelize.transaction(); // Start transaction
    try {
        const { carId, startDate, endDate, paymentMethod, amount, extra } = req.body;
        const userId = req.user.id;

        if (!carId || !startDate || !endDate || !paymentMethod || !amount) {
            await transaction.rollback();
            return res.status(400).json({ message: "Missing required fields." });
        }

        const car = await Car.findByPk(carId, { transaction });
        if (!car || car.status !== "available") {
            await transaction.rollback();
            return res.status(400).json({ message: "Car is not available." });
        }

        const overlappingBooking = await Rental.findOne({
            where: {
                car_id: carId,
                [Op.or]: [
                    { start_date: { [Op.lte]: endDate }, end_date: { [Op.gte]: startDate } }
                ]
            },
            transaction
        });

        if (overlappingBooking) {
            await transaction.rollback();
            return res.status(400).json({ message: "Car is already booked for the selected dates." });
        }

        console.log("Car object:", car);


        const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
        const totalAmount = parseFloat(car.price_per_day) * days;

        // Add debug logs here:
        console.log(`Car price per day: ${car.price_per_day} (parsed: ${parseFloat(car.price_per_day)})`);
        console.log(`Days: ${days}`);
        console.log(`Calculated total amount: ${totalAmount}`);

        if (parseFloat(amount) !== totalAmount) {
            await transaction.rollback();
            log.error(`Calculated amount: ${totalAmount}, Provided amount: ${amount}`);
            return res.status(400).json({ message: "Calculated amount does not match provided amount." });
        }

        const booking = await Rental.create({
            user_id: userId, car_id: carId, start_date: startDate, end_date: endDate,
            total_amount: totalAmount, status: "pending", payment_method: paymentMethod,
            payment_status: "pending", amount: amount, extra: extra,
        }, { transaction });

        const paymentSuccessful = await processPayment(amount, paymentMethod);

        if (paymentSuccessful) {
            await booking.update({ payment_status: "completed", status: "confirmed", payment_date: new Date() }, { transaction });
            await car.update({ status: "booked" }, { transaction });
            await transaction.commit();
            res.status(201).json(booking);
        } else {
            await booking.update({ payment_status: "failed", status: "failed" }, { transaction });
            await car.update({ status: "available" }, { transaction });
            await transaction.rollback();
            res.status(400).json({ message: "Payment failed." });
        }
    } catch (error) {
        await transaction.rollback();
        log.error(`Error creating booking: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get a specific booking
exports.getBooking = async (req, res) => {
    try {
        const booking = await Rental.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }
        res.json(booking);
    } catch (error) {
        log.error(`Error getting booking: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Rental.findAll({
            where: {
                user_id: userId
            }
        });
        res.json(bookings);
    } catch (error) {
        log.error(`Error getting user bookings: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Placeholder for payment processing (replace with your gateway logic)
async function processPayment(amount, paymentMethod) {
    if (paymentMethod === "test") {
        return true;
    }
    return Math.random() < 0.8;
}