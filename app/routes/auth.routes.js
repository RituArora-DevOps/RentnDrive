const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth"); // Assuming you have an auth middleware

// User registration
router.post("/register", authController.register);

// User login
router.post("/login", authController.login);

// Get user info
router.get("/users/:userId", authMiddleware.verifyToken, authController.getUserInfo);

module.exports = router;

/*
WT Secret:
Store your JWT_SECRET securely in an environment variable and never expose it in your code.
Error Handling:
Customize the error messages and logging to suit your needs.
Token Expiration:
Set an appropriate expiration time for your JWT tokens.
HTTPS:
Always use HTTPS to protect your API and prevent token interception.
*/