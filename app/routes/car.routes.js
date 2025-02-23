const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");
const authMiddleware = require("../middleware/auth");

// Get all cars
router.get("/cars", carController.getAllCars);

// Get available cars for specific dates
router.get("/cars/available", carController.getAvailableCars);

// Add a new car (admin only)
router.post("/cars", authMiddleware.verifyToken, carController.addCar);

// Update a car (admin only)
router.put("/cars/:id", authMiddleware.verifyToken, carController.updateCar);

// Delete a car (admin only)
router.delete("/cars/:id", authMiddleware.verifyToken, carController.deleteCar);


// Get a car by ID
router.get("/cars/:id", carController.getCarById);

module.exports = router;
/*
car.routes.js:
Defines the API routes for car management.
Uses the authMiddleware.verifyToken for routes that require admin privileges (add, update, delete).
Adds get car by ID.
*/