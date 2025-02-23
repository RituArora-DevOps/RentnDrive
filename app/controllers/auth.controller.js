const db = require("../models/db");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("../config/jwt"); // For JWT generation
const log = require("../../logger");

// User registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({
            where: {
                [db.Op.or]: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            phone,
            role: role || "customer", // Default to customer if role is not provided
        });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        log.error(`Registration error: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: jwtConfig.expiresIn, algorithm: jwtConfig.algorithm
        });

        res.json({ token, role: user.role, username: user.username, id: user.id });
    } catch (error) {
        log.error(`Login error: ${error.message}`);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get user info
exports.getUserInfo = async (req, res) => {
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