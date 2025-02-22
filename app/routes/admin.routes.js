const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller"); // Import admin controller

// Route to get a list of all cars (supports sorting)
router.get("/cars", adminController.getAllCars);

// Route to add a new car
router.post("/cars", adminController.addCar);

// Route to update car details (ID cannot be changed)
router.put("/cars/:id", adminController.updateCar);

// Route to delete a car (cannot delete all cars)
router.delete("/cars/:id", adminController.deleteCar);

// Route to get a list of all bookings (supports sorting)
router.get("/orders", adminController.getAllOrders);

// Route to cancel a booking (cannot cancel all bookings)
router.put("/orders/:id/cancel", adminController.cancelOrder);

// Route to get booking summary (last week/month/year)
router.get("/orders/summary", adminController.getOrderSummary);

// Route to get a list of all customers (supports sorting)
router.get("/customers", adminController.getAllCustomers);

// Route to delete a customer (cannot delete all customers)
router.delete("/customers/:id", adminController.deleteCustomer);

//Route to add a booking (only for testing)
router.post("/orders", adminController.addOrder);

// Route to add a customer (only for testing)
router.post("/customers", adminController.addCustomer);



module.exports = router; // Export the router to be used in the main server file
