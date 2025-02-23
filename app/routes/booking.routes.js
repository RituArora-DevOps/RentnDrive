const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middleware/auth"); // Assuming you have an auth middleware

// Check car availability
router.get("/cars/available", bookingController.checkAvailability);

// Create a new booking (includes payment processing)
router.post("/bookings", authMiddleware.verifyToken, bookingController.createBooking);

// Get a specific booking (if needed)
router.get("/bookings/:id", authMiddleware.verifyToken, bookingController.getBooking);

// Get all bookings for a user (if needed)
router.get("/bookings/user", authMiddleware.verifyToken, bookingController.getUserBookings);

module.exports = router;


/*
 Notes of me:
Explanation of Routes:

/cars/available (GET):
Checks car availability for a given date range.
/bookings (POST):
Creates a new booking and processes the payment.
Requires authentication.
/bookings/:id (GET):
Retrieves details of a specific booking.
Requires authentication.
/bookings/user (GET):
Retrieves all bookings for the authenticated user.
Requires authentication.
 */