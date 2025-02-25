const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller"); // Import admin controller

/**
 * Admin routes for managing cars, orders, and customers.
 * @module AdminRoutes
 */

/**
 * Express router for admin-related routes.
 * @const {express.Router}
 */

/**
 * Route to get a list of all cars (supports sorting).
 * @name GET /api/admin/cars
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.get("/cars", adminController.getAllCars);

/**
 * Route to add a new car.
 * @name POST /api/admin/cars
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing car details.
 * @param {express.Response} res - Express response object.
 */
router.post("/cars", adminController.addCar);

/**
 * Route to update car details (ID cannot be changed).
 * @name PUT /api/admin/cars/:id
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing updated car details.
 * @param {express.Response} res - Express response object.
 */
router.put("/cars/:id", adminController.updateCar);

/**
 * Route to delete a car (cannot delete all cars).
 * @name DELETE /api/admin/cars/:id
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing car ID.
 * @param {express.Response} res - Express response object.
 */
router.delete("/cars/:id", adminController.deleteCar);

/**
 * Route to get a list of all bookings (supports sorting).
 * @name GET /api/admin/orders
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.get("/orders", adminController.getAllOrders);

/**
 * Route to cancel a booking (cannot cancel all bookings).
 * @name DELETE /api/admin/orders/:id
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing booking ID.
 * @param {express.Response} res - Express response object.
 */
router.delete("/orders/:id", adminController.deleteOrder);

/**
 * Route to get booking summary (last week/month/year).
 * @name GET /api/admin/orders/summary
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.get("/orders/summary", adminController.getOrderSummary);

/**
 * Route to get a list of all customers (supports sorting).
 * @name GET /api/admin/customers
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
router.get("/customers", adminController.getAllCustomers);

/**
 * Route to delete a customer (cannot delete all customers).
 * @name DELETE /api/admin/customers/:id
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing customer ID.
 * @param {express.Response} res - Express response object.
 */
router.delete("/customers/:id", adminController.deleteCustomer);


/**
 * Route to add a booking (only for testing).
 * @name POST /api/admin/orders
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing booking details.
 * @param {express.Response} res - Express response object.
 */

/*
//Route to add a booking (only for testing)

router.post("/orders", adminController.addOrder);

/**
 * Route to add a customer (only for testing).
 * @name POST /api/admin/customers
 * @function
 * @memberof module:AdminRoutes
 * @param {express.Request} req - Express request object containing customer details.
 * @param {express.Response} res - Express response object.
 */
router.post("/customers", adminController.addCustomer);

module.exports = router; // Export the router to be used in the main server file
