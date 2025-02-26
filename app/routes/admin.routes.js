const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller"); // Import admin controller
const authMiddleware = require("../middleware/auth");

router.get("/cars", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getAllCars);
router.post("/cars", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.addCar);
router.put("/cars/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.updateCar);
router.delete("/cars/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.deleteCar);

// Apply similar changes for orders and customer routes
router.get("/orders", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getAllOrders);
router.delete("/orders/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.deleteOrder);
router.get("/orders/summary", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getOrderSummary);
router.get("/customers", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.getAllCustomers);
router.delete("/customers/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.deleteCustomer);
router.post("/customers", authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.addCustomer);

module.exports = router; // Export the router to be used in the main server file
