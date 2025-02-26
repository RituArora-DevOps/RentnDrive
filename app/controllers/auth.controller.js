const sequelize = require("../models/db");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken library
const log = require("../../logger");
const { Op } = require("sequelize");
const jwtConfig = require("../config/jwt");
const { body, validationResult } = require('express-validator'); // Import express-validator

// User registration
const register = [ // Use express-validator middleware
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters.'),
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters.'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password, phone, role } = req.body;

            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }],
                },
            });

            if (existingUser) {
                return res.status(400).json({ message: "Username or email already exists." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                username,
                email,
                password_hash: hashedPassword,
                phone,
                role: role || "customer",
            });

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            log.error(`Registration error: ${error.message}`);
            res.status(500).json({ message: "Internal server error." });
        }
    }
];

// User login
const login = [ // Use express-validator middleware
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;

            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ message: "Invalid username or password." });
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid username or password." });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: jwtConfig.expiresIn,
                algorithm: jwtConfig.algorithm
            });

            res.json({ token, role: user.role, username: user.username, id: user.id });
        } catch (error) {
            log.error(`Login error: ${error.message}`);
            res.status(500).json({ message: "Internal server error." });
        }
    }
];

// Get user info
const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password_hash"] }, // Exclude password hash
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        log.error(`Get user info error: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

/*
Added a new function: getUserInfo.
This function retrieves user information based on the provided userId parameter.
It uses User.findByPk(userId) to find the user by their primary key.
It excludes the password_hash attribute from the response for security reasons.
It handles cases where the user is not found (404 error).
It includes error handling.
How it works:

An admin (or a user with appropriate permissions) makes a GET request to /api/users/{userId}.
The authMiddleware.verifyToken middleware verifies the JWT token in the request's Authorization header.
If the token is valid, the getUserInfo function is executed.
The function retrieves the user's information from the database (excluding the password hash).
The user's information is sent back as a JSON response.
If the token is invalid or the user is not found, an appropriate error response is sent.
*/

// Verify Token function
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        log.warn(`Token verification failed: ${error.message}`);
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = {
    register,
    login,
    getUserInfo,
    verifyToken, // Export verifyToken
};

/*
Explanation:

const jwt = require("jsonwebtoken"); and const log = require("../logger");
These lines import the necessary modules: jsonwebtoken for JWT verification and your logging module.
  
const verifyToken = (req, res, next) => { ... }
This defines the verifyToken middleware function.
It takes three arguments: req (request object), res (response object), and next (function to call the next middleware or route handler).
const token = req.header("Authorization");
This line retrieves the JWT token from the Authorization header of the request.
The token is expected to be in the format "Bearer <token>".
if (!token) { ... }
This if block checks if a token is present in the header.
If no token is found, it sends a 401 (Unauthorized) response with an error message.
try { ... } catch (error) { ... }
This try-catch block handles token verification.
const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
This line verifies the JWT token using jwt.verify().
token.replace("Bearer ", "") removes the "Bearer " prefix from the token.
process.env.JWT_SECRET is your secret key used to sign the token.
If the token is valid, jwt.verify() returns the decoded payload (user information).
req.user = decoded;
This line attaches the decoded user information to the req.user property.
This allows subsequent middleware or route handlers to access the user's information.
next();
This line calls the next() function, which proceeds to the next middleware or route handler.
catch (error) { ... }
If the token is invalid or verification fails, this catch block executes.
It logs the error and sends a 400 (Bad Request) response with an error message.
module.exports = { verifyToken };
This line exports the verifyToken middleware function.
How to Use It:

Import the verifyToken middleware into your route files.
Apply the middleware to routes that require authentication.
*/